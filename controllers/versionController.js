const modelModel = require("../models/modelModel");
const versionModel = require("../models/versionModel");
const mongoose = require("mongoose");

// get all Versions
const getVersions = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Versions = await versionModel.find({});

  res.status(200).json(Versions);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};
// get a single Version
const getVersion = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Version" });
  }

  const Version = await versionModel.findById(id);

  if (!Version) {
    return res.status(404).json({ error: "No such Version" });
  }

  res.status(200).json(Version);
};

// create a new Version
const createVersion = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { version, model } = req.body;
  let emptyFields = [];
  if (!model) {
    emptyFields.push("model");
  }
  if (!version) {
    emptyFields.push("version");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  if (!mongoose.Types.ObjectId.isValid(model)) {
    return res.status(404).json({ error: "Model Must Be An ID" });
  }
  const modelExist = await modelModel.findOne({ _id: model });
  if (!modelExist) {
    return res.status(404).json({ error: "model Does Not Exist" });
  }

  /* const duplicated = await versionModel.find({
    brand,
    model,
    version,
  });
  if (duplicated.length > 0) {
    return res.status(400).json({ error: "Version Already Exists!" });
  } */
  // add to the database
  try {
    const newVersion = await versionModel.create({
      version,
      model,
    });
    res.status(200).json({ version: newVersion, method: "create" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Version
const deleteVersion = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Version" });
  }

  const Version = await versionModel.findByIdAndDelete(id);

  if (!Version) {
    return res.status(400).json({ error: "No such Version" });
  }

  res.status(200).json({ version: Version, method: "version" });
};

// update a Version
const updateVersion = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Version" });
  }
  const version = await versionModel.findById(id);
  if (!version) {
    return res.status(400).json({ error: "No such Version" });
  }
  if (req.body.model) {
    if (!mongoose.Types.ObjectId.isValid(req.body.model)) {
      return res.status(404).json({ error: "Model Must Be An ID" });
    }
    const modelExist = await modelModel.findOne({ _id: req.body.model });
    if (!modelExist) {
      return res.status(404).json({ error: "Model Does Not Exist" });
    }
  }
  if (req.body.model || req.body.version) {
    const duplicated = await versionModel.find({
      model: req.body.model ? req.body.model : version.model,
      version: req.body.version ? req.body.version : version.version,
    });
    if (duplicated.length > 0) {
      return res.status(400).json({ error: "Version Already Exists!" });
    }
  }
  const newVersion = await versionModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    { new: true }
  );

  res.status(200).json({ version: newVersion, method: "update" });
};

module.exports = {
  getVersions,
  getVersion,
  createVersion,
  deleteVersion,
  updateVersion,
  getPermissions,
};
