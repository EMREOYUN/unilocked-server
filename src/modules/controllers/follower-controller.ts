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
import { GET, POST } from "../decorators/requests";
import { body, checkSchema } from "express-validator";
import { isDocument } from "@typegoose/typegoose";
import getProfileModel from "../services/profile";

export class FollowerController extends BaseController {
  listen(router: Router): void {}

  @POST(
    "/toggle",
    checkSchema({
      profileId: {
        in: ["body"],
        isMongoId: true,
      },
      followerId: {
        in: ["body"],
        isMongoId: true,
      },
      profileType: {
        in: ["body"],
        isString: true,
      },
      followerType: {
        in: ["body"],
        isString: true,
      },
    })
  )
  async toggle(req: Request, res: Response) {
    const profilID: string = req.body.profileId;
    const followerID: string = req.body.followerId;
    const profileType: string = req.body.profileType;
    const followerType: string = req.body.followerType;

    if (!profilID || !followerID || !profileType || !followerType) {
      res.status(400).send({
        success: false,
        message: "Invalid request",
      });
      return;
    }

    const following = await follow(
      req.user,
      OID(profilID),
      profileType,
      OID(followerID),
      followerType
    );
    res.send(
      success({
        followed: following,
      })
    );
  }

  @GET("/:profileId")
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

  @POST("/avaible-chat-users", body("profileId").isMongoId())
  async avaibleChatUsers(req: Request, res: Response) {
    const profileId = req.body.profileId;
    const profileType: string = req.body.profileType;
    const profile = await getProfileModel(profileType).findById(OID(profileId));
    if (!profile) {
      res.status(404).send({
        success: false,
        message: "Profile not found",
      });
      return;
    }
    const following = FollowersModel.find({
      followerId: profileId,
    }).populate("following");
    const pagination = await PaginateService.paginate(
      req,
      FollowersModel,
      following
    );
    pagination.data = pagination.data
      .map((following) => {
        if (isDocument(following.following)) {
          return following.following;
        } else {
          return null;
        }
      })
      .filter((user) => user !== null);
    res.send(success(pagination));
  }
}
