import { DocumentType } from "@typegoose/typegoose";
import { User } from "../../../models/user";
import { v4 } from "uuid";
import { hash256 } from "../hash256";
import { sendHtmlMail } from "./send-mail";
import { EmailVerifyModel, UserModel } from "../../../resolved-models";

export async function sendVerificationMail(user1: DocumentType<User>) {
  const user = await UserModel.findOne({ _id: user1._id }).select("+email");

  const email = user.email;
  const file = process.env.APP_PATH + "/views/email/verify-email.ejs";

  const uuid = v4();
  const sha256 = hash256(uuid);

  const created = await EmailVerifyModel.create({
    email: email,
    token: sha256,
  });

  let link =
    process.env.APP_URL + `/api/auth/email/verify/${created._id}/${uuid}`;

  const signature = hash256(link);

  link = link + "?signature=" + signature;

  const data = {
    link: link,
    subject: "Email Doğrulama - " + process.env.APP_NAME,
  };
  await sendHtmlMail(file, email, data);
}
