import { DocumentType } from "@typegoose/typegoose";
import { User } from "../../../models/user";
import { v4 } from "uuid";
import { hash256 } from "../hash256";
import { sendHtmlMail } from "./send-mail";
import {
  EmailVerifyModel,
  PasswordResetModel,
  UserModel,
} from "../../../resolved-models";
import bcrypt from "bcrypt";

export async function sendPasswordResetMail(user1: DocumentType<User>) {
  const user = await UserModel.findOne({ _id: user1._id }).select("+email");
  const email = user.email;
  const file = process.env.APP_PATH + "/views/email/reset-password.ejs";

  const uuid = v4();

  const salt = bcrypt.genSaltSync(10);
  const hashedToken = bcrypt.hashSync(uuid, salt);

  const created = await PasswordResetModel.create({
    email: email,
    token: hashedToken,
  });

  let link = process.env.APP_URL + `/password/reset/${created._id}/${uuid}`;

  const signature = hash256(link);

  link = link + "?signature=" + signature;

  const data = {
    link: link,
    subject: "Parola Sıfırlama - " +  process.env.APP_NAME,
  };
  await sendHtmlMail(file, email, data);
}
