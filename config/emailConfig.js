import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, //587
  secure: false, // true for 465, false for other ports
  auth: {
    user: "lanetnikul1999@gmail.com", // generated ethereal user
    pass: "tnferpuvqrpttvyo", // generated ethereal password
  },
});

export default transporter;
