import express from "express";
import UserController from "../controller/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

const router = express.Router();

// protected middleware
// router.use("/changepassword", );

//public Routes whithout login
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post(
  "/send-reset-password-email",
  UserController.sendUserPasswordResetEmail
);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);

//protected Routes whithin Login
router.post(
  "/changepassword",
  checkUserAuth,
  UserController.changeUserPassword
);
router.get("/loggedUser", checkUserAuth, UserController.loggedUser);
export default router;
