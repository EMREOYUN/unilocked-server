import express, { Express } from "express";
import { Server as TusServer } from "@tus/server";
import { S3Store } from "@tus/s3-store";
import { FileModel } from "../../resolved-models";
import { uploadImageByUrl } from "../services/images/upload-image-by-url";

export class UploadController {
  private s3Store = new S3Store({
    partSize: 8 * 1024 * 1024, // Each uploaded part will have ~8MB,
    s3ClientConfig: {
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  private server: TusServer = new TusServer({
    path: "/files",
    datastore: this.s3Store,
    onUploadCreate: async (req: any, res, upload) => {
      const file = new FileModel({
        name: upload.metadata.filename,
        size: upload.size,
        type: upload.metadata.filetype,
        path: upload.id,
        uploadId: upload.id,
        user: req.user._id,
        uploadFinished: false,
        createdAt: new Date(),
      });
      await file.save();

      return res;
    },
    onUploadFinish: async (req, res, upload) => {
      const file = await FileModel.findOne({ uploadId: upload.id });
      file.uploadFinished = true;
      await file.save();
      await uploadImageByUrl(file);
      upload.metadata.fileEntry = JSON.stringify(file.toObject());

      return res;
    },
  });

  private uploadApp: Express;

  constructor(app: Express) {
    this.uploadApp = express();

    this.uploadApp.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });

    this.uploadApp.all(
      "*",
      (req, res, next) => {
        next();
      },
      this.server.handle.bind(this.server)
    );

    app.use(
      "/files",
      (req, res, next) => {
        next();
      },
      this.uploadApp
    );
  }

  listen(): void {}
}
