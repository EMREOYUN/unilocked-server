import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';

export function sendHtmlMail(filePath: string,to:string, data:any) {
    console.log("Sending mail to: ", to,data);
    const transporter = nodemailer.createTransport({
        service : process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    // rendered html by ejs
    const file = fs.readFileSync(filePath, 'utf-8');
    const rendered = ejs.render(file, data);

    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: to,
        subject: data.subject,
        html: rendered,
        replyTo: data.replyTo ? data.replyTo : process.env.CONTACT_MAIL
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Error sending mail: ", error);
                reject(error);
            } else {
                console.log("Email sent: " + info.response);
                resolve(info);
            }
        });
    });
}