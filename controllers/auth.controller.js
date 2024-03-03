const bcrypt = require("bcrypt");
const statusEnum = require("../enums/status");
const User = require("../models/user.model");
const jwtUtils = require("../utils/jwt");
const openai = require("../utils/chatgpt");
const fs = require("fs").promises;
const { sendEmail } = require("../utils/sendPlan");
const { sendOtp } = require("../utils/sendOtp");
const { OTP } = require("../utils/otp");
const { sendFeedback } = require("../utils/sendFeedback");
const { setUser, getUser } = require("../user/set");

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, uname } = req.body;
      const check = await User.findOne({ email });

      if (check)
        return res
          .status(400)
          .json({ success: false, msg: "Email already exists" });

      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hash,
        uname,
      });

      const data = await user.save();

      setUser(uname, "");

      const { password: pw, ...response } = data?._doc;

      return res.json({ success: true, data: response });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error?.message });
    }
  },

  verify: async (req, res) => {
    try {
      var otp = "";
      const { logged_user } = getUser();
      const user = await User.findOne({ uname: logged_user });
      if (user?.otp === "") {
        otp = OTP();
        sendOtp(user?.uname, user?.email, otp);
        await User.updateOne(
          { uname: logged_user },
          { $set: { otp, status: statusEnum.ACTIVE } }
        );
      }
      res.json({
        success: true,
        otp: otp,
      });
    } catch (error) {
      console.error("Error in otp endpoint:", error);
      res.json({
        success: false,
        problem: error,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { uname, password } = req.body;
      const user = await User.findOne({ uname });

      if (!user)
        return res.status(400).json({ success: false, msg: "User not found" });

      const match = await bcrypt.compare(password, user?.password);

      if (!match)
        return res
          .status(400)
          .json({ success: false, msg: "Wrong username or password" });

      if (user?.status !== statusEnum.ACTIVE) {
        return res
          .status(400)
          .json({ success: false, msg: "Account not active" });
      }

      const { password: pw, ...userData } = user?._doc;

      accessToken = jwtUtils.generateToken({ userId: user?._id });

      //const { l_user, usertoken } = getUser();  refernce

      return res.json({
        check: userData?.gender,
        success: true,
        data: { accessToken, user: userData },
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error?.message });
    }
  },

  update: async (req, res) => {
    try {
      const { age, uname, weight, height, email } = req.body;

      const user = User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ succes: false, message: "User not found" });
      }

      const result = await User.updateOne(
        { email },
        { $set: { uname, age, height, weight } }
      );

      if (result.nModified === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({
        success: true,
        data: { message: "User details updated successfully" },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  gpt: async (req, res) => {
    try {
      const logged_user = req.body.uname;
      const userPrompt = req.body.user_prompt;

      const user = await User.findOne({ uname: logged_user });

      if (!userPrompt) {
        return res.status(400).json({
          success: false,
          error: "User prompt is missing in the request body.",
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 750,
      });

      if (
        response.choices &&
        response.choices[0] &&
        response.choices[0].message &&
        response.choices[0].message.content
      ) {
        sendEmail(
          logged_user,
          user?.email,
          response.choices[0].message.content
        );

        return res.json({
          success: true,
          data: response.choices[0].message.content,
        });
      } else if (response.error) {
        return res.status(500).json({
          success: false,
          error: response.error.message,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Failed to retrieve a valid response from OpenAI.",
        });
      }
    } catch (error) {
      console.error("Error:", error);

      return res.status(500).json({
        success: false,
        error: "An internal server error occurred.",
      });
    }
  },

  learn: async (req, res) => {
    const { fileName } = req.body;
    try {
      console.log(fileName);
      const fileContent = await fs.readFile(`${fileName}.txt`, "utf-8");
      res.json({ content: fileContent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error reading file content." });
    }
  },

  otp: async (req, res) => {
    try {
      const { logged_user } = getUser();
      const user = await User.findOne({ uname: logged_user });
      if (user?.otp === "") {
        const otp = OTP();
        sendOtp(user?.uname, user?.email, otp);
        await User.updateOne({ uname: logged_user }, { $set: { otp } });
      }
      res.json({
        success: true,
        otp: user?.otp,
      });
    } catch (error) {
      console.error("Error in otp endpoint:", error);
      res.json({
        success: false,
        problem: error,
      });
    }
  },

  get_otp: async (req, res) => {
    try {
      const { logged_user } = getUser();
      const user = await User.findOne({ uname: logged_user });
      await User.updateOne({ uname: logged_user }, { $set: { otp: "" } });
      return res.json({
        success: true,
        otp: user?.otp,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        msg: "failure",
      });
    }
  },

  reset: async (req, res) => {
    try {
      const { password } = req.body;
      const { logged_user } = getUser();

      const user = await User.findOne({ uname: logged_user });

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const updatedUser = await User.findOneAndUpdate(
        { uname: logged_user },
        { $set: { password: hash, otp: "" } }
      );

      return res.json({
        success: true,
        body: { message: "Update successful", data: updatedUser },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  feedback: async (req, res) => {
    try {
      const { feedback, uname } = req.body;

      const user = await User.findOne({ uname });

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      sendFeedback(uname, feedback);

      return res.json({
        success: true,
        message: "finally",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  googlesignup: async (req, res) => {
    try {
      const { displayName, uid, email } = req.body;
      const check = await User.findOne({ email, uname: displayName });

      if (check)
        return res
          .status(400)
          .json({ success: false, msg: "Email already exists" });

      const hash = await bcrypt.hash(uid, 10);

      const user = new User({
        email,
        status: "ACTIVE",
        uname: displayName,
        password: hash,
      });

      await user.save();

      return res.json({ success: true, msg: "new user made" });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "failure" });
    }
  },

  profile: async (req, res) => {
    try {
      const { gender, age, height, weight } = req.body;

      const { logged_user } = getUser();
      const user = User.findOne({ uname: logged_user });

      const result = await user.updateOne(
        { uname: logged_user },
        { $set: { gender, age, height, weight } }
      );

      if (result.nModified === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({
        success: true,
        data: { message: "User details updated successfully" },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  googlesignin: async (req, res) => {
    try {
      const { email, displayName } = req.body;

      const user = await User.findOne({ email, uname: displayName });
      if (!user) return res.json({ success: false, msg: "user not found" });

      const { password: pw, ...userData } = user?._doc;

      accessToken = jwtUtils.generateToken({ userId: user?._id });

      setUser(user?.uname, accessToken);

      return res.json({
        success: true,
        msg: "finally",
        data: { accessToken, user: userData },
      });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "failure" });
    }
  },

  forgot: async (req, res) => {
    try {
      const { user } = req.body;

      setUser(user, "");

      return res.json({
        success: true,
        msg: "successful",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        mag: "User not found",
      });
    }
  },
};

module.exports = authController;
