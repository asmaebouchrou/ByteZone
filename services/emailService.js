// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports = {
  sendMail: (options) => {
    return transporter.sendMail({
      from: `"ByteZone" <${process.env.MAIL_USER}>`,
      ...options
    });
  }
};
