const transporter = require("../config/nodemailer");

const sendOtp = async (uname, email, otp) => {
  return await transporter.sendMail({
    from: '"Thyroid" testing7988@gmail.com',
    to: email,
    subject: "Your Otp",
    html: `
        <div>
        <p>Dear ${uname},</p>
        <p>Here's your otp....</p>
        <h1>${otp}</h1>
        </div>
    `,
  });
};

module.exports = { sendOtp };
