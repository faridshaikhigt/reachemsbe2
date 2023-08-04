import nodemailer from "nodemailer";
import dotenv from "dotenv";
import qrcodeGenerator from "./qr-code-generator.js";
dotenv.config();

const PORT = process.env.EMAIL_PORT;
const SMTP_PORT = process.env.SMTP_PORT;
const HOST_SERVICE = process.env.HOST_SERVICE;

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

const SENDERS_EMAIL = USER_EMAIL;
const CC = [];
const BCC = [];



const transporter = nodemailer.createTransport({
  host: HOST_SERVICE,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});

export const sendQRMail = async(RECEIVERS_EMAIL, qrCodeData) => {
  const qrCodeImage = await qrcodeGenerator(qrCodeData);
  const emailOptions = {
    from: SENDERS_EMAIL,
    to: RECEIVERS_EMAIL,
    cc: CC,
    bcc: BCC,
    subject: "QR Code",
    html: `<h4>Please find the QR code attached: </h4><img src="${qrCodeImage}">`,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrCodeImage.split(";base64,").pop(),
        encoding: "base64",
      },
    ],
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendLoginDetails = (RECEIVERS_EMAIL, LoginDetails) => {
  const emailOptions = {
    from: SENDERS_EMAIL,
    to: RECEIVERS_EMAIL,
    cc: CC,
    bcc: BCC,
    subject: "Login details for Reach",
    html: `<h4>Please find your login details below: </h4>
    <br><p>Username: ${LoginDetails.email}</p>
    <br><p>Password: ${LoginDetails.password}</p>`,
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

}
