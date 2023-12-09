import { Request, Response, Router } from "express";
import { JobPosting } from "./../../models/job-posting";
import BaseController from "./base-controller";
import {
  JobApplicationModel,
  JobPostingModel,
  PartnerModel,
  RoleModel,
} from "../../resolved-models";
import PaginateService from "../services/paginate";
import success from "../responses/success";
import { OID } from "../helpers/generate-object-id";
import { errorTr } from "../responses/error";
import getProfileModel from "../services/profile";
import checkProfilePermission from "../services/check-profile-permission";
import ensureAuthorized from "../middleware/ensure-authorized";
import { param } from "express-validator";
export class JobPostingController extends BaseController {
  listen(router: Router): void {
    router.get("/", ensureAuthorized("jobPosting.show"), this.index);
    router.get(
      "/:id",
      ensureAuthorized("jobPosting.show"),
      param("id").isMongoId(),
      this.show
    );
    router.post("/", this.store);
    router.put("/:id", param("id").isMongoId(), this.update);
    router.delete("/:id", param("id").isMongoId(), this.destroy);
    router.post(
      "/:id/applications",
      param("id").isMongoId(),
      this.addApplication
    );

    router.delete(
      "/:id/applications",
      param("id").isMongoId(),
      this.removeApplication
    );

    router.get(
      "/:id/applications",
      param("id").isMongoId(),
      this.getApplications
    );

    router.get(
      "/applications/:id",
      param("id").isMongoId(),
      this.getApplication
    );

    router.put(
      "/applications/:id",
      param("id").isMongoId(),
      this.updateApplication
    );

    router.put(
      "/applications/:id/status",
      param("id").isMongoId(),
      this.changeApplicationStatus
    );
  }

  async index(req: Request, res: Response) {
    const find: any = {};

    if (req.query.creatorId) {
      find.creatorId = req.query.creatorId;
    }

    if (req.query.creatorType) {
      find.creatorType = req.query.creatorType;
    }

    if (req.query.query) {
      find.title = { $regex: req.query.query, $options: "i" };
    }

    const jobPosting = JobPostingModel.find(find);

    const pagination = await PaginateService.paginate(
      req,
      JobPostingModel,
      jobPosting
    );

    res.send(success(pagination));
  }

  async show(req: Request, res: Response) {
    const jobPosting = await JobPostingModel.findById(OID(req.params.id))
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    res.send(success(jobPosting));
  }

  async store(req: Request, res: Response) {
    const profileType = req.body.creatorType;
    const profileId = req.body.creatorId;

    const profile = await getProfileModel(profileType)
      .findById(profileId)
      .exec();

    if (!profile) {
      res.status(500).send(errorTr("Profile not found"));
      return;
    }

    if (!checkProfilePermission(req.user, profile, "jobPosting.create")) {
      res
        .status(403)
        .send(errorTr("You don't have permission to create job posting"));
      return;
    }

    const roleID = OID(req.body.roleId);

    const role = await RoleModel.findById(roleID).exec();

    if (!role) {
      res.status(500).send(errorTr("Role not found"));
      return;
    }

    const jobPosting = new JobPostingModel(req.body);
    await jobPosting.save();

    for (let partner of req.body.partners) {
      const partnerModel = new PartnerModel({
        partnerType: partner.partnerType,
        partnerId: OID(partner.partnerId),
        parentId: jobPosting._id,
      });

      await partnerModel.save();
    }

    res.send(success(jobPosting));
  }

  async update(req: Request, res: Response) {
    const jobPosting = await JobPostingModel.findById(OID(req.params.id))
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.update"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to update job posting"));
      return;
    }

    const roleID = OID(req.body.roleId);

    const role = await RoleModel.findById(roleID).exec();

    if (!role) {
      res.status(500).send(errorTr("Role not found"));
      return;
    }

    jobPosting.set(req.body);
    await jobPosting.save();

    // remove old partners
    await PartnerModel.deleteMany({ parentId: jobPosting._id }).exec();

    // add new partners
    for (let partner of req.body.partners) {
      const partnerModel = new PartnerModel({
        partnerType: partner.partnerType,
        partnerId: OID(partner.partnerId),
        parentId: jobPosting._id,
      });

      await partnerModel.save();
    }

    res.send(success(jobPosting));
  }

  async destroy(req: Request, res: Response) {
    const jobPosting = await JobPostingModel.findById(OID(req.params.id))
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.delete"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to delete job posting"));
      return;
    }

    await jobPosting.deleteOne();

    await PartnerModel.deleteMany({ parentId: jobPosting._id }).exec();

    res.send(success(jobPosting));
  }

  async addApplication(req: Request, res: Response) {
    const jobPosting = await JobPostingModel.findById(OID(req.params.id))
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.addApplicant"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to add applicant"));
      return;
    }

    const existingApplication = JobApplicationModel.findOne({
      jobId: jobPosting._id,
      userId: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).send(errorTr("You already applied"));
    }

    const application = new JobApplicationModel({
      jobId: jobPosting._id,
      userId: req.user._id,
      description: req.body.description.trim().slice(0, 500),
      rejected: false,
      accepted: false,
      pending: true,
    });

    await application.save();

    res.send(success(application));
  }

  async removeApplication(req: Request, res: Response) {
    const jobPosting = await JobPostingModel.findById(OID(req.params.id))
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    const application = await JobApplicationModel.findOne({
      jobId: jobPosting._id,
      userId: req.user._id,
    });

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.removeApplicant"
      ) &&
      req.user._id !== application.userId
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to remove applicant"));
      return;
    }

    if (!application) {
      return res.status(400).send(errorTr("You didn't apply"));
    }

    await application.deleteOne();

    res.send(success(application));
  }

  async changeApplicationStatus(req: Request, res: Response) {
    const application = await JobApplicationModel.findOne({
      _id: OID(req.params.id),
    });

    if (!application) {
      return res.status(400).send(errorTr("User didn't apply"));
    }

    const jobPosting = await JobPostingModel.findById(application.jobPostingId)
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.changeApplicantStatus"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to change applicant status"));
      return;
    }

    if (req.body.status === "accepted") {
      application.accepted = true;
      application.rejected = false;
      application.pending = false;
    } else if (req.body.status === "rejected") {
      application.accepted = false;
      application.rejected = true;
      application.pending = false;
    } else {
      application.accepted = false;
      application.rejected = false;
      application.pending = true;
    }

    await application.save();

    res.send(success(application));
  }

  async updateApplication(req: Request, res: Response) {
    const application = await JobApplicationModel.findOne({
      _id: OID(req.params.id),
    });

    if (!application) {
      return res.status(400).send(errorTr("User didn't apply"));
    }

    const jobPosting = await JobPostingModel.findById(application.jobPostingId)
      .populate("creator")
      .exec();

    if (!jobPosting) {
      res.status(404).send(errorTr("Job posting not found"));
      return;
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.updateApplicant"
      ) &&
      req.user._id !== application.userId
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to update applicant"));
      return;
    }

    application.set(req.body);
    await application.save();

    res.send(success(application));
  }

  async getApplications(req: Request, res: Response) {
    const jobPosting = await JobPostingModel.findById(OID(req.params.id))
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.applications.show"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to get applications"));
      return;
    }

    const applications = JobApplicationModel.find({
      jobId: jobPosting._id,
    });

    const pagination = await PaginateService.paginate(
      req,
      JobApplicationModel,
      applications
    );

    res.send(success(pagination));
  }

  async getApplication(req: Request, res: Response) {
    const application = await JobApplicationModel.findById(OID(req.params.id))
      .populate("userId")
      .exec();

    if (!application) {
      return res.status(404).send(errorTr("Application not found"));
    }

    const jobPosting = await JobPostingModel.findById(application.jobPostingId)
      .populate("creator")
      .exec();

    if (!jobPosting) {
      return res.status(404).send(errorTr("Job posting not found"));
    }

    if (
      !checkProfilePermission(
        req.user,
        jobPosting.creator as any,
        "jobPosting.applications.show"
      )
    ) {
      res
        .status(403)
        .send(errorTr("You don't have permission to get application"));
      return;
    }

    res.send(success(application));
  }
}
