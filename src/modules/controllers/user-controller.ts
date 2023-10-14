
import { Router } from "express";
import mongoose from "mongoose";
import BaseController from "./base-controller";
import { UserModel } from "../../resolved-models";
import ensureAuthorized from "../middleware/ensure-authorized";
import ensureAuthenticated from "../middleware/ensure-authenticated";


export class UserController extends BaseController {

  listen(router: Router): void {
    router.get("/:userID/company", ensureAuthorized("company.view"), async (req, res, next) => {
      const companyName = this.getCompanyName(req.params.userID);

      res.send({ success: true, companyName: companyName});
      next();
    });
  }

  public byEmail(email: string) {
    return UserModel.findOne({ email: email });
  }
  
  public byId(_id: string) {
    return UserModel.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  }

  public byUsername(username: string) {
    return UserModel.findOne({ name: username });
  }

  public getCompanyName(id: string) {
    this.byId(id).populate("company").name;
  }
}
