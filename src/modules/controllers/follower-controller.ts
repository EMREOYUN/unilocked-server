import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import {
  CommunityModel,
  CompanyModel,
  FollowersModel,
  UserModel,
} from "../../resolved-models";
import { follow } from "../services/follow";
import { OID } from "../helpers/generate-object-id";
import success from "../responses/success";
import PaginateService from "../services/paginate";
import checkProfilePermission from "../services/check-profile-permission";

export class FollowerController extends BaseController {
  listen(router: Router): void {
    router.post("/toggle", this.toggle);
    router.get("/:profileId", this.index);
  }

  async toggle(req: Request, res: Response) {
    const profilID: string = req.body.profilID;
    const followerID: string = req.body.followerID;
    const profileType: string = req.body.profileType;
    const followerType: string = req.body.followerType;

    await follow(
      req.user,
      OID(profilID),
      profileType,
      OID(followerID),
      followerType
    );
  }
  async index(req: Request, res: Response) {
    const profileId = req.params.profileId;
    const followers = FollowersModel.find({
      followingId: profileId,
    }).populate("follower");
    const paginate = await PaginateService.paginate(
      req,
      FollowersModel,
      followers
    );
    res.send(
      success({
        pagination: paginate,
      })
    );
  }
}
