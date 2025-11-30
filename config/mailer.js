const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,   //  correo
        pass: process.env.MAIL_PASS    // contraseña o app password
    }
});

module.exports = transporter;
