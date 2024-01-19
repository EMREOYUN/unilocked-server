import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { checkSchema } from "express-validator";
import { EmailVerifyModel, UserModel } from "../../resolved-models";
import { hash256 } from "../services/hash256";
import { OID } from "../helpers/generate-object-id";
import { GET } from "../decorators/requests";

export default class EmailVerificationController extends BaseController {
 
  @GET(
    "/verify/:id/:token",
    checkSchema({
      id: {
        in: ["params"],
        isMongoId: true,
      },
      token: {
        in: ["params"],
        isString: true,
      },
      signature: {
        in: ["query"],
        isString: true,
      },
    })
  )
  async get(req: Request, res: Response) {
    const token = await EmailVerifyModel.findById(OID(req.params.id));

    if (!token) {
      return res.send({ success: false, error: "Token not found" });
    }

    const now = new Date();
    const created = token.created_at;
    const diff = now.getTime() - created.getTime();
    const diffInHours = diff / (1000 * 3600);

    if (diffInHours > 1) {
      await token.deleteOne();
      return res.send({
        success: false,
        error: "Token is expired",
        status: "fail",
        errors: { general: "Token is expired" },
      });
    }

    const hashedToken = hash256(req.params.token);

    if (token.token !== hashedToken) {
      return res.send({ success: false, error: "Token is invalid" });
    }

    const link =
      process.env.APP_URL +
      `/secure/auth/email/verify/${req.params.id}/${req.params.token}`;

    const signature = hash256(link);

    if (signature !== req.query.signature) {
      return res.send({ success: false, error: "Signature is invalid" });
    }

    const user = await UserModel.findOne({ email: token.email }).select(
      "+email"
    );
    if (user.email_verified_at !== null) {
      return res.send({ success: false, error: "Email is already verified" });
    }
    user.email_verified_at = new Date();
    await user.save();
    await token.deleteOne();
    res.redirect(process.env.APP_URL + "/login?emailVerified=true");
  }
}
