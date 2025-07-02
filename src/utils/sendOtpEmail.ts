import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";

export const sendOtpEmail = async (to: string, otp: number) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL_USER!,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
