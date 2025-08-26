const modelModel = require("../models/modelModel");
const mongoose = require("mongoose");
const brandModel = require("../models/brandModel");

// get all Models
const getModels = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Models = await modelModel.find({});

  res.status(200).json(Models);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};
// get a single Model
const getModel = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Model" });
  }

  const Model = await modelModel.findById(id);

  if (!Model) {
    return res.status(404).json({ error: "No such Model" });
  }

  res.status(200).json(Model);
};

// create a new Model
const createModel = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { model, brand } = req.body;
  let emptyFields = [];

  if (!brand) {
    emptyFields.push("brand");
  }
  if (!model) {
    emptyFields.push("model");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  if (!mongoose.Types.ObjectId.isValid(brand)) {
    return res.status(404).json({ error: "Brand Must Be An ID" });
  }
  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) {
    return res.status(404).json({ error: "Brand Does Not Exist" });
  }
  const duplicated = await modelModel.find({ brand, model });
  if (duplicated.length > 0) {
    return res.status(400).json({ error: "Model Already Exists!" });
  }
  // add to the database
  try {
    const newModel = await modelModel.create({ model, brand });
    res.status(200).json({ model: newModel, method: "create" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Model
const deleteModel = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Model" });
  }

  const Model = await modelModel.findByIdAndDelete(id);

  if (!Model) {
    return res.status(400).json({ error: "No such Model" });
  }
  res.status(200).json({ model: Model, method: "delete" });
};

// update a Model
const updateModel = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Model" });
  }
  const model = await modelModel.findById(id);
  if (!model) {
    return res.status(400).json({ error: "No such Model" });
  }
  if (req.body.brand) {
    if (!mongoose.Types.ObjectId.isValid(req.body.brand)) {
      return res.status(404).json({ error: "Brand Must Be An ID" });
    }
    const brandExist = await brandModel.findOne({ _id: req.body.brand });
    if (!brandExist) {
      return res.status(404).json({ error: "Brand Does Not Exist" });
    }
  }
  if (req.body.model || req.body.brand) {
    const duplicated = await modelModel.find({
      model: req.body.model ? req.body.model : model.model,
      brand: req.body.brand ? req.body.brand : model.brand,
    });
    if (duplicated.length > 0) {
      return res.status(400).json({ error: "Model Already Exists!" });
    }
  }

  try {
    const newModel = await modelModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    return res.status(200).json({ model: newModel, method: "update" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getModels,
  getModel,
  createModel,
  deleteModel,
  updateModel,
  getPermissions,
};
