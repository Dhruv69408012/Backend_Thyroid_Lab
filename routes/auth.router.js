const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.get("/verify", authController.verify);
router.post("/login", authController.login);
router.post("/update", authController.update);
router.post("/gpt", authController.gpt);
router.post("/learn", authController.learn);
router.post("/otp", authController.otp);
router.post("/reset", authController.reset);
router.post("/feedback", authController.feedback);
router.post("/googlesignup", authController.googlesignup);
router.post("/googlesignin", authController.googlesignin);
router.post("/forgot", authController.forgot);
router.get("/gotp", authController.get_otp);
router.post("/profile", authController.profile);
module.exports = router;
