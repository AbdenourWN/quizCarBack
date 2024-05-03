const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const roleModel = require("../models/roleModel");
const validator = require("validator");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "10d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await userModel.signup(fullName, email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//createUser By Admin
const createUser = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { fullName, email, password, role } = req.body;

  try {
    const user = await userModel.createUser(fullName, email, password, role);

    res.status(200).json({ user: user, method: "create" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all Users
const getUsers = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Users = await userModel.find({});

  res.status(200).json(Users);
};

// get a single User
const getUser = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such User" });
  }

  const User = await userModel.findById(id);

  if (!User) {
    return res.status(404).json({ error: "No such User" });
  }

  res.status(200).json(User);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};
const getMe = (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

// delete a Role
const deleteUser = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such User" });
  }
  const UserVerification = await userModel.findById(id);
  if (!UserVerification) {
    return res.status(400).json({ error: "No such User" });
  }
  const userRole = await roleModel.findById(UserVerification.role);
  if (userRole.role === "admin") {
    const admins = await userModel.find({ role: userRole._id });
    if (admins.length < 2) {
      return res
        .status(400)
        .json({ error: "At Least One Admin Account Must Exist" });
    }
  }
  const User = await userModel.findByIdAndDelete(id);

  return res.status(200).json({ user: User, method: "delete" });
};

// update a Role
const updateUser = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such User" });
  }
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(400).json({ error: "User not Found" });
  }
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ error: "Email not valid" });
    }
    if (req.body.email !== user.email) {
      req.body.email = req.body.email.toLowerCase();
      const exists = await userModel.findOne({ email: req.body.email });

      if (exists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }
  }
  if (req.body.role) {
    if (!mongoose.Types.ObjectId.isValid(req.body.role)) {
      return res.status(400).json({ error: "Role Must Be An ID" });
    }
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
  }
  try {
    const User = await userModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ user: User, method: "update" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateOldUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such User" });
  }
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(400).json({ error: "User not Found" });
  }
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ error: "Email not valid" });
    }
    if (req.body.email !== user.email) {
      req.body.email = req.body.email.toLowerCase();
      const exists = await userModel.findOne({ email: req.body.email });

      if (exists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }
  }
  if (req.body.role) {
    if (!mongoose.Types.ObjectId.isValid(req.body.role)) {
      return res.status(400).json({ error: "Role Must Be An ID" });
    }
  }
  if (req.body.oldPassword && req.body.newPassword) {
    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Old Password is Incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.newPassword, salt);
    req.body.password = hash;
  } else if (req.body.oldPassword || req.body.newPassword) {
    return res.status(400).json({ error: "Old and New passwords required" });
  }
  try {
    const User = await userModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ user: User, method: "update" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getMe,
  getPermissions,
  updateOldUser,
};
