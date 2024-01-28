const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "testing7988@gmail.com",
    pass: "hfep xwbd yqum tamz",
  },
});
module.exports = transporter;
