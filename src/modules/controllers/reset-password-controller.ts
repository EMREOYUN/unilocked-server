import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { PasswordResetModel, UserModel } from "../../resolved-models";
import { v4 } from "uuid";
import { hash256 } from "../services/hash256";
import { sendPasswordResetMail } from "../services/mail/send-password-reset-mail";
import { checkSchema } from "express-validator";
import { OID } from "../helpers/generate-object-id";

export default class ResetPasswordController extends BaseController {
  listen(router: Router): void {
    router.post(
      "/email",
      checkSchema({
        email: {
          in: ["body"],
          isEmail: true,
          errorMessage: "Please enter a valid email",
        },
      }),
      this.generate
    );
    router.post(
      "/reset",
      checkSchema({
        id: {
          in: ["body"],
          isMongoId: true,
        },
        token: {
          in: ["body"],
          isString: true,
        },
        signature: {
          in: ["body"],
          isString: true,
        },
        email: {
          in: ["body"],
          isEmail: true,
          errorMessage: "Please enter a valid email",
        },
        password_confirmation: {
          in: ["body"],
          isString: true,
          errorMessage: "Please enter a valid password confirmation",
        },
        password: {
          in: ["body"],
          isString: true,
          errorMessage: "Please enter a valid password",
        },
      }),
      this.reset
    );
  }

  public async generate(req: Request, res: Response) {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.send({ success: false, error: "User not found" });
    }

    await sendPasswordResetMail(user);

    res.send({ success: true, status: "success" });
  }

  public async reset(req: Request, res: Response) {
    const token = await PasswordResetModel.findById(OID(req.body.id));

    if (!token) {
      return res.send({ success: false, error: "Token not found" ,status : 'fail', errors : {general : 'Token not found'}});
    }

    // check token created before 1 hour
    const now = new Date();
    const created = token.created_at;
    const diff = now.getTime() - created.getTime();
    const diffInHours = diff / (1000 * 3600);

    if (diffInHours > 1) {
        await token.deleteOne();
        return res.send({ success: false, error: "Token is expired" ,status : 'fail', errors : {general : 'Token is expired'}});
    }

    const compare = bcrypt.compareSync(req.body.token, token.token);

    if (!compare) {
      return res.send({ success: false, error: "Token is invalid" ,status : 'fail', errors : {general : 'Token is invalid'}});
    }

    const link = process.env.APP_URL + `/password/reset/${req.body.id}/${req.body.token}`;


    const signature = hash256(link);

    if (signature != req.body.signature) {
      return res.send({ success: false, error: "Signature is invalid",status : 'fail', errors : {general : 'Signature is invalid'} });
    }

    const user = await UserModel.findOne({ email: token.email }).select("+email");

    if (!user) {
      return res.send({ success: false, error: "User not found" ,status : 'fail', errors : {email : 'User not found'}});
    }

    const email = req.body.email;

    if (email !== user.email) {
      return res.send({ success: false,status : 'fail',  error: "Email is invalid",errors : {email : 'Email is invalid'} });
    }

    const password = req.body.password;
    const password_confirmation = req.body.password_confirmation;

    if (password !== password_confirmation) {
      return res.send({ success: false, error: "Passwords do not match",status : 'fail', errors : {password : 'Passwords do not match'} });
    }

    

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    await user.save();
    await token.deleteOne();
    res.send({ success: true, status: "success" });
  }
}
