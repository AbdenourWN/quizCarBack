const permissionModel = require("../models/permissionModel");
const mongoose = require("mongoose");
const roleModel = require("../models/roleModel");

// get all Permissions
const getPermissions = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Permissions = await permissionModel.find({}).sort({ createdAt: 1 });

  res.status(200).json(Permissions);
};
const getPermissionss = (req, res) => {
  return res.status(200).json(req.user.permission);
};
// get a single Permission
const getPermission = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Permission" });
  }

  const Permission = await permissionModel.findById(id);

  if (!Permission) {
    return res.status(404).json({ error: "No such Permission" });
  }

  res.status(200).json(Permission);
};

// create a new Permission
/* const createPermission = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { Get, Post, Patch, Delete, role, feature } = req.body;
  if (!mongoose.Types.ObjectId.isValid(role)) {
    return res.status(404).json({ error: "Role Must Be An ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(feature)) {
    return res.status(404).json({ error: "Feature Must Be An ID" });
  }
  const duplicated = await permissionModel.find({ role, feature });
  if (duplicated.length > 0) {
    return res.status(400).json({ error: "Permission Already Exists!" });
  }
  // add to the database
  try {
    const newPermission = await permissionModel.create({
      Get,
      Post,
      Patch,
      Delete,
      role,
      feature,
    });
    res.status(200).json(newPermission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; */

// delete a Permission
const deletePermission = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Permission" });
  }
  const permissionRole = await permissionModel.findById(id);
  if (!permissionRole) {
    return res.status(400).json({ error: "No such Permission" });
  }
  const role = await roleModel.findById(permissionRole.role);
  if (role.role === "admin") {
    return res
      .status(400)
      .json({ error: "Cannot delete Permission Of Admin or User" });
  }
  const Permission = await permissionModel.findByIdAndUpdate(
    id,
    {
      Get: false,
      Post: false,
      Delete: false,
      Patch: false,
    },
    { new: true }
  );

  return res.status(200).json({ permission: Permission, method: "update" });
};

// update a Permission
const updatePermission = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Permission" });
  }
  if (req.body.role) {
    return res.status(400).json({ error: "Cannot Update Role ID" });
  }
  if (req.body.feature) {
    return res.status(400).json({ error: "Cannot Update Feature ID" });
  }
  const permissionRole = await permissionModel.findById(id);
  if (!permissionRole) {
    return res.status(400).json({ error: "No such Permission" });
  }
  const role = await roleModel.findById(permissionRole.role);
  if (role.role === "admin") {
    return res
      .status(400)
      .json({ error: "Cannot Update Permission Of Admin or User" });
  }
  const Permission = await permissionModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    { new: true }
  );

  res.status(200).json({ permission: Permission, method: "update" });
};

module.exports = {
  getPermissions,
  getPermission,
  /* createPermission, */
  deletePermission,
  updatePermission,
  getPermissionss,
};
