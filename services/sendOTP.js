const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_ID ,
      pass: process.env.GMAIL_PASS
    },
});

module.exports= transporter