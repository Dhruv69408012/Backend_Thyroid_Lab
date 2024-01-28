const transporter = require("../config/nodemailer");

const sendFeedback = async (uname, feedback) => {
  return await transporter.sendMail({
    from: '"Feedback" testing7988@gmail.com',
    to: "testing7988@gmail.com",
    subject: "Feedback",
    html: `
        <div>
            <p>
                From ${uname}.....
            </p>
            <p>
                ${feedback}
            </p>
        </div>
    `,
  });
};

module.exports = { sendFeedback };
