import { Request, Response } from "express";
import { GET } from "../decorators/requests";
import BaseController from "./base-controller";
import { param } from "express-validator";
import { FileModel } from "../../resolved-models";
import { errorTr } from "../responses/error";
import success from "../responses/success";

export class FileController extends BaseController {
  @GET("/uploaded/:id", param("id").isString())
  public async getUploadedFile(req: Request, res: Response) {
    const file = await FileModel.findOne({
      uploadId: req.params.id,
    }).exec();
    if (!file) {
      return res.status(404).send(errorTr("File not found"));
    }
    res.send(success(file?.toObject()));
  }
}
