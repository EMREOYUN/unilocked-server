import { Request, Response, Router } from "express";
import { param, query } from "express-validator";
import mongoose from "mongoose";
import { Project } from "../../models/project";
import ensureAuthorized from "../middleware/ensure-authorized";
import success from "../responses/success";
import PaginateService from "../services/paginate";
import BaseController from "./base-controller";
import {
  ProjectAnalyticsModel,
  ProjectApplicationModel,
  ProjectModel,
} from "../../resolved-models";
import { OID } from "../helpers/generate-object-id";
import checkProfilePermission from "../services/check-profile-permission";
import error, { errorTr } from "../responses/error";
import getProfileModel from "../services/profile";
import { DocumentType } from "@typegoose/typegoose";
import { Profile } from "../../models/profile";
import { tr } from "../services/translator";
import { ProjectApplication } from "../../models/relations/projects/project-application";

export class ProjectController extends BaseController {
  listen(router: Router): void {
    //Get project by ID
    router.get(
      "/:id",
      ensureAuthorized("projects.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const project = await this.byId(req.params.id);
        res.send({
          sucess: true,
          data: project,
        });
        next();
      }
    );

    // TODO: Check schema
    router.post("/", ensureAuthorized("projects.create"), this.createProject);
    router.put("/:id", this.updateProject);
    router.delete("/:id", this.delete);
    router.delete("/multiple", this.deleteMultiple);

    // applications
    router.post("/:id/add-application", this.addApplication);
    router.delete("/:id/remove-application", this.removeApplication);
    router.get("/:id/applications", this.getApplications);
    router.get("/:id/applications/:applicationId", this.getApplication);
    router.put(
      "/:id/applications/:applicationId/change-status",
      this.changeApplicationStatus
    );

    // analytics

    //Get project
    router.get(
      "/",
      ensureAuthorized("projects.view"),
      query("q").isString(),
      async (req, res, next) => {
        const query = req.query.q as string;
        const find = {
          $or: [
            {
              name: {
                $regex: query,
                $options: "i",
              },
            },
            {
              description: {
                $regex: query,
                $options: "i",
              },
            },
          ],
        };
        const projects = ProjectModel.find(find);

        res.send(
          success(await PaginateService.paginate(req, ProjectModel, projects))
        );
        next();
      }
    );
  }

  public byId(_id: string) {
    return ProjectModel.findOne<Project>({
      _id: new mongoose.Types.ObjectId(_id),
    });
  }

  async createProject(req: Request, res: Response) {
    const ownerId = OID(req.body.owner);
    const ownerType = req.body.ownerType;

    if (!ownerId || !ownerType) {
      res.status(400).send(errorTr("Owner and ownerType are required"));
      return;
    }

    const owner = await getProfileModel(ownerType).findById(ownerId);

    if (!checkProfilePermission(req.user, owner, "projects.create")) {
      res
        .status(403)
        .send(errorTr("You don't have permission to create project"));
      return;
    }

    const project = new ProjectModel(req.body);
    await project.save();
    res.send(success(project));
  }

  async updateProject(req: Request, res: Response) {
    const project = await ProjectModel.findById(OID(req.params.id))
      .populate("owner")
      .exec();
    if (!project) {
      res.status(404).send("Project not found");
    } else {
      if (
        checkProfilePermission(
          req.user,
          project.owner as any,
          "projects.update"
        )
      ) {
        project.set(req.body);
        await project.save();
        res.send(success(project));
      } else {
        res
          .status(403)
          .send(errorTr("You don't have permission to update this project"));
      }
    }
  }

  async delete(req: Request, res: Response) {
    const project = await ProjectModel.findById(OID(req.params.id))
      .populate("owner")
      .exec();
    if (!project) {
      res.status(404).send(errorTr("Project not found"));
    } else {
      await this.deleteProject(req.user, project);
      res.send(success(project));
    }
  }

  async deleteMultiple(req: Request, res: Response) {
    const projectIds = req.body.projectIds;
    const projects = await ProjectModel.find({
      _id: {
        $in: projectIds.map((id) => OID(id)),
      },
    }).populate("owner");
    for (const project of projects) {
      await this.deleteProject(req.user, project);
    }
    res.send(success(projects));
  }

  async deleteProject(user: Express.User, project: DocumentType<Project>) {
    const owner = project.owner as DocumentType<Profile>;
    if (checkProfilePermission(user, owner, "projects.delete")) {
      await project.deleteOne();
      return project;
    } else {
      throw new Error(tr("You don't have permission to delete this project"));
    }
  }

  async addApplication(req: Request, res: Response) {
    const id = OID(req.params.id);

    const application = await ProjectApplicationModel.findOne({
      userId: req.user._id,
    });

    if (application) {
      res.send(errorTr("You already have an application"));
      return;
    }

    const project = await ProjectModel.findById(id).populate("owner").exec();

    if (!project) {
      res.status(404).send(errorTr("Project not found"));
      return;
    }

    const created = new ProjectApplicationModel({
      userId: req.user._id,
      projectId: id,
      description: req.body.description,
      pending: true,
    });
    await created.save();

    res.send(success(created));
  }

  async removeApplication(req: Request, res: Response) {
    const id = OID(req.params.id);

    const application = await ProjectApplicationModel.findOne({
      userId: req.user._id,
    });

    if (!application) {
      res.send(errorTr("You don't have an application"));
      return;
    }

    const project = await ProjectModel.findById(id).populate("owner").exec();

    if (!project) {
      res.status(404).send(errorTr("Project not found"));
      return;
    }

    await application.deleteOne();

    res.send(success(application));
  }

  async getApplications(req: Request, res: Response) {
    const id = OID(req.params.id);

    const project = await ProjectModel.findById(id).populate("owner").exec();

    if (!project) {
      res.status(404).send(errorTr("Project not found"));
      return;
    }

    if (
      !checkProfilePermission(
        req.user,
        project.owner as any,
        "projects.applications.view"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to view applications"));
      return;
    }

    const applications = ProjectApplicationModel.find({
      projectId: id,
    });

    const pagination = await PaginateService.paginate(
      req,
      ProjectApplicationModel,
      applications
    );

    res.send(success(pagination));
  }

  async getApplication(req: Request, res: Response) {
    const id = OID(req.params.id);
    const applicationId = OID(req.params.applicationId);

    const project = await ProjectModel.findById(id).populate("owner").exec();

    if (!project) {
      res.status(404).send(errorTr("Project not found"));
      return;
    }

    if (
      !checkProfilePermission(
        req.user,
        project.owner as any,
        "projects.applications.view"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to view applications"));
      return;
    }

    const application = await ProjectApplicationModel.findById(applicationId);
    res.send(success(application));
  }

  async changeApplicationStatus(req: Request, res: Response) {
    const id = OID(req.params.id);
    const applicationId = OID(req.params.applicationId);
    const status: "accepted" | "rejected" = req.body.status;

    const project = await ProjectModel.findById(id).populate("owner").exec();

    if (!project) {
      res.status(404).send(errorTr("Project not found"));
      return;
    }

    if (
      !checkProfilePermission(
        req.user,
        project.owner as any,
        "projects.applications.change-status"
      )
    ) {
      res
        .status(403)
        .send(
          errorTr("You don't have permission to change application status")
        );
      return;
    }

    const application = await ProjectApplicationModel.findById(applicationId);

    if (!application) {
      res.status(404).send(errorTr("Application not found"));
      return;
    }

    if (status === "accepted") {
      application.pending = false;
      application.accepted = true;
      application.rejected = false;
    } else if (status === "rejected") {
      application.pending = false;
      application.accepted = false;
      application.rejected = true;
      application.rejected_reason = req.body.rejected_reason;
    }

    await application.save();

    res.send(success(application));
  }

  async getAnalytics(req: Request, res: Response) {
    const id = OID(req.params.id);

    const project = await ProjectModel.findById(id).populate("owner").exec();

    if (!project) {
      res.status(404).send(errorTr("Project not found"));
      return;
    }

    if (
      !checkProfilePermission(
        req.user,
        project.owner as any,
        "projects.analytics.view"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to view analytics"));
      return;
    }

    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const applications = await ProjectApplicationModel.find({
      projectId: id,
    }).count();

    const views = await ProjectAnalyticsModel.find({
      project: id,
      action: "view",
      date: {
        $gte: lastMonth,
      },
    }).count();

    res.send(success({
      applications,
      views,
    }));
  }
}
