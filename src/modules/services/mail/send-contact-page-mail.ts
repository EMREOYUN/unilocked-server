import { sub } from "date-fns";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "../../../models/user";
import { v4 } from "uuid";
import { hash256 } from "../hash256";
import { sendHtmlMail } from "./send-mail";
import { EmailVerifyModel, UserModel } from "../../../resolved-models";

export async function sendContactPageMail(
  email: string,
  name: string,
  message: string,
  user_id: number,
  user_name: string
) {
  const file = process.env.APP_PATH + "/views/email/contact-page.ejs";

  const data = {
    email: email,
    name: name,
    message: message,
    user_id: user_id,
    user_name: user_name,
    subject: "İletişim Formu - " + process.env.APP_NAME,
    replyTo: email,
  };
  await sendHtmlMail(file, process.env.CONTACT_MAIL, data);
}
