import { Request, Response, Router } from "express";
import { param, query } from "express-validator";
import mongoose from "mongoose";
import { Project } from "../../models/project";
import ensureAuthorized from "../middleware/ensure-authorized";
import success from "../responses/success";
import PaginateService from "../services/paginate";
import BaseController from "./base-controller";
import { ProjectModel } from "../../resolved-models";
import { OID } from "../helpers/generate-object-id";
import checkProfilePermission from "../services/check-profile-permission";
import error, { errorTr } from "../responses/error";
import getProfileModel from "../services/profile";

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
    router.put("/:id", ensureAuthorized("projects.update"), this.updateProject);

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
}
