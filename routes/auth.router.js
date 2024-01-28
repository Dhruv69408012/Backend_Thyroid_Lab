const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.get("/verify", authController.verify);
router.post("/login", authController.login);
router.post("/profile", authController.profile);
router.get("/disp", authController.disp);
router.post("/update", authController.update);
router.post("/gpt", authController.gpt);
router.post("/report", authController.report);
router.post("/learn", authController.learn);
router.get("/logout", authController.logout);
router.post("/otp", authController.otp);
router.post("/reset", authController.reset);
router.post("/feedback", authController.feedback);
router.post("/googlesignup", authController.googlesignup);
router.post("/googlesignin", authController.googlesignin);
router.get("/access", authController.access);
router.post("/forgot", authController.forgot);
module.exports = router;
