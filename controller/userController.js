import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
  static singToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });
  };

  // Registration functiom

  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already registered" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });

            // Generate jwt Token
            const token = this.singToken(saved_user._id);
            res.status(201).json({
              status: "success",
              token: token,
              message: "Registration success...",
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "Unable to Register" });
          }
        } else {
          res.send({
            status: "failed",
            message: "password and password_confirmation doesn't match",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  // login function

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate jwt Token
            const token = this.singToken(user._id);

            res.status(201).json({
              status: "success",
              token: token,
              message: "Login Success...",
            });
          } else {
            res.send({
              status: "failed",
              message: "E-Mail or Password not correct..",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not Registered User..",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };

  // User change password

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;

    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "Password or confirmation password same..",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: hashPassword },
        });

        res.send({
          status: "success  ",
          message: "Password change Successfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required.." });
    }
  };

  // find data logged in user

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  //send email user password reset

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });

      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://127.0.0.1:8000/api/user/reset/${user._id}/${token}`;
        console.log(link);

        // Send Email

        let info = await transporter.sendMail({
          from: "lanetnikul1999@gmail.com", // sender address
          to: user.email, // list of receivers
          subject: "Password Reset Link", // Subject line
          // text: "Hello world?", // plain text body
          html: `<b><a href=${link}> Click Hear </a></b> To Reset Your Password`, // html body
        });

        res.status(201).json({
          status: "success",
          message: "Password Reset Email send... Please Check Your Email...",
          info: info,
        });
      } else {
        res.send({ status: "failed", message: "Email does't Exists..." });
      }
    } else {
      res.send({ status: "failed", message: "Email fields are required.." });
    }
  };

  // user password reset

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ status: "failed", message: "Password are not match..." });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: hashPassword },
          });
          res.status(201).json({
            status: "success",
            message: "Password reset successfully...",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "password and confirm password are required..",
        });
      }
    } catch (e) {
      console.log(e);
      res.send({ status: "failed", message: "Invalid Token.." });
    }
  };
}

export default UserController;
