import { Request, Response, Router } from "express";
import { JobPosting } from "./../../models/job-posting";
import BaseController from "./base-controller";
import { JobPostingModel } from "../../resolved-models";
import PaginateService from "../services/paginate";
import success from "../responses/success";
import { OID } from "../helpers/generate-object-id";
import { errorTr } from "../responses/error";
import getProfileModel from "../services/profile";
import checkProfilePermission from "../services/check-profile-permission";
export class JobPostingController extends BaseController {
  listen(router: Router): void {}

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

    const jobPosting = new JobPostingModel(req.body);
    await jobPosting.save();

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

    jobPosting.set(req.body);
    await jobPosting.save();

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

    res.send(success(jobPosting));
  }
}
