import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get token from headers
      token = authorization.split(" ")[1];

      // Verification Token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Get User from Token
      req.user = await UserModel.findById(userId).select("-password");
      next();
    } catch (e) {
      console.log(e);
      res.send({ status: "failed", message: "Unauthorized User.." });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ status: "failed", message: "Unauthorized User., No token" });
  }
};

export default checkUserAuth;
