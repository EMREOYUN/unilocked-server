import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { GET } from "../decorators/requests";
import { MembersModel, SettingModel } from "../../resolved-models";

export default class BootstrapDataController extends BaseController {
  @GET("/bootstrap-data")
  public async bootstrapData(req: Request, res: Response) {
    const publicSettings = await SettingModel.find({ private: false }).lean();
    const user = req.user;
    const members = await MembersModel.find({
      member: user._id,
    })
      .populate([
        {
          path: "profile",
        },
        {
          path: "memberRole",
        },
      ])
      .lean();

    res.send({
      success: true,
      data: {
        settings: publicSettings,
        user,
        members,
      },
    });
  }
}
