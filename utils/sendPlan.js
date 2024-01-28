const transporter = require("../config/nodemailer");

const sendEmail = async (uname, email, body) => {
  return await transporter.sendMail({
    from: '"Thyroid" testing7988@gmail.com',
    to: email,
    subject: "Your Plan",
    html: `
        <div>
        <p>Dear ${uname},</p>
        <p>Here's your plan....</p>
        <p>${body}</p>
        </div>
    `,
  });
};

module.exports = { sendEmail };
