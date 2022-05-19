const express = require("express");
const {
  login,
  createMerchant,
  createUser,
  logout,
  verify,
  sendVerificationEmail,
  forgotPassword,
  changePassword,
  loginWithGoogle,
} = require("../controllers/auth");
const router = express.Router();

router.route("/login").post(login);
router.route("/register/merchant").post(createMerchant);
router.route("/register/user").post(createUser);
router.route("/logout").post(logout);
router.route("/merchant/verify/:id/:token").get(verify);
router.route("/user/verify/:id/:token").get(verify);
router.post("/send-email", sendVerificationEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/change-password/:id/:token").post(changePassword);
router.route("/google-login").post(loginWithGoogle);

module.exports = router;
