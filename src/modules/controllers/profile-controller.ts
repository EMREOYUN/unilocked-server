import { Router } from "express";
import BaseController from "./base-controller";
import { checkSchema, param } from "express-validator";
import { updateProfile } from "../repositories/profile-repository";
import success from "../responses/success";
import { profileValidation } from "../../validators/profile-validator";
import ensureAuthenticated from "../middleware/ensure-authenticated";
import ensureAuthorized from "../middleware/ensure-authorized";

export default class ProfileController extends BaseController {
  listen(router: Router): void {
    router.put(
      "/:id",
      param("id").isMongoId(),
      checkSchema(profileValidation),
      
      async (req, res, next) => {
        const profile = await updateProfile(req.body.modelType, req.body);
        res.send(success(profile));
      }
    );
  }
}
