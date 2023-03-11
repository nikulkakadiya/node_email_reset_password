import mongoose from "mongoose";

//Defining Schema

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Enter your name.."], trim: true },
  email: { type: String, required: [true, "Enter your E-Mail.."], trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true },
});

//Create model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
