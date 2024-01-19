import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { checkSchema, param } from "express-validator";
import { updateProfile } from "../repositories/profile-repository";
import success from "../responses/success";
import { profileValidation } from "../../validators/profile-validator";
import ensureAuthenticated from "../middleware/ensure-authenticated";
import ensureAuthorized from "../middleware/ensure-authorized";
import { GET, PUT } from "../decorators/requests";
import getProfileModel from "../services/profile";
import { OID } from "../helpers/generate-object-id";
import checkProfilePermission from "../services/check-profile-permission";

export default class ProfileController extends BaseController {
  @PUT(
    "/:profileType/:id",
    param("id").isMongoId(),
    checkSchema(profileValidation)
  )
  async updateProfile(req: Request, res: Response) {
    
    const profile = await updateProfile(req.params.profileType, OID(req.params.id), req.body,req.user);
    
    res.send(success(profile));
  }

  @GET("/:profileType/:id", param("id").isMongoId())
  async getProfile(req: Request, res: Response) {
    // uc first type
    let type = req.params.profileType;
    type = type.toLocaleLowerCase();
    type = type.charAt(0).toUpperCase() + type.slice(1);
    const profile = await getProfileModel(req.params.profileType).findOne({
      _id: req.params.id,
    }).populate("posts");
    res.send(success(profile));
  }

}
