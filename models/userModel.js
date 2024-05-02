const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const roleModel = require("../models/roleModel");

const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
  },
  { timestamps: true }
);

// static signup method
userModel.statics.signup = async function (fullName, email, password) {
  // validation
  if (!email || !password || !fullName) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const role = await roleModel.findOne({ role: "user" });
  email = email.toLowerCase();
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    fullName,
    email,
    password: hash,
    role: role._id,
  });

  return user;
};

//admin create user
userModel.statics.createUser = async function (
  fullName,
  email,
  password,
  role
) {
  // validation
  if (!email || !password || !fullName || !role) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  if (!mongoose.Types.ObjectId.isValid(role)) {
    throw Error("Role Must Be An ID");
  }
  const roleExist = await roleModel.findOne({ _id: role });
  if (!roleExist) {
    throw Error("Role Does Not Exist");
  }
  email = email.toLowerCase();

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    fullName,
    email,
    password: hash,
    role
  });

  return user;
};

// static login method
userModel.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  email = email.toLowerCase();

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email or Password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect Email or Password");
  }

  return user;
};

module.exports = mongoose.model("User", userModel);
