const roleModel = require("../models/roleModel");
const permissionModel = require("../models/permissionModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

// get all Roles
const getRoles = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Roles = await roleModel.find({});

  res.status(200).json(Roles);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};
// get a single Role
const getRole = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Role" });
  }

  const Role = await roleModel.findById(id);

  if (!Role) {
    return res.status(404).json({ error: "No such Role" });
  }

  res.status(200).json(Role);
};

// create a new Role
const createRole = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { role, permissions } = req.body;
  let emptyFields = [];

  if (!role) {
    emptyFields.push("role");
  }
  if (!permissions) {
    emptyFields.push("permissions");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  // add to the database
  try {
    const roleLower = role.toLowerCase();
    const newRole = await roleModel.create({ role: roleLower });
    permissions.forEach(async (permission) => {
      await permissionModel.create({ ...permission, role: newRole._id });
    });
    res.status(200).json({ role: newRole, method: "create" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Role
const deleteRole = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Role" });
  }
  const undeletableRoles = ["admin", "user"];
  const roleVerification = await roleModel.findById(id);
  if (!roleVerification) {
    return res.status(400).json({ error: "No such Role" });
  }
  if (undeletableRoles.includes(roleVerification.role)) {
    return res.status(400).json({ error: "Role cannot be deleted" });
  }

  const Role = await roleModel.findByIdAndDelete(id);
  if (!Role) {
    return res.status(400).json({ error: "Try Again Role Error" });
  }
  const permissions = await permissionModel.find({
    role: Role._id,
  });
  if (!permissions) {
    return res.status(400).json({ error: "Try Again Permissions Error" });
  }
  permissions.forEach(async (permission) => {
    await permissionModel.findByIdAndDelete(permission._id);
  });
  const users = await userModel.find({ role: Role._id });
  if (!users) {
    return res.status(400).json({ error: "Try Again User Error" });
  }
  const roleUser = await roleModel.findOne({ role: "user" });

  users.forEach(async (user) => {
    await userModel.findByIdAndUpdate(
      user._id,
      { role: roleUser._id },
      { new: true }
    );
  });
  return res.status(200).json({ role: Role, method: "delete" });
};

// update a Role
const updateRole = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Role" });
  }

  const undeletableRoles = ["admin", "user"];
  const roleVerification = await roleModel.findById(id);
  if (!roleVerification) {
    return res.status(400).json({ error: "No such Role" });
  }
  if (undeletableRoles.includes(roleVerification.role)) {
    return res.status(400).json({ error: "Role cannot be modified" });
  }
  if (req.body.role) {
    req.body.role = req.body.role.toLowerCase();
    const duplicated = await roleModel.find({ ...req.body });
    if (duplicated.length > 0) {
      return res.status(400).json({ error: "Role Name Already Exists!" });
    }
  }

  try {
    const Role = await roleModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ role: Role, method: "update" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  deleteRole,
  updateRole,
  getPermissions,
};
