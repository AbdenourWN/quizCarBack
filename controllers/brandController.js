const brandModel = require("../models/brandModel");
const modelModel = require("../models/modelModel");
const versionModel = require("../models/versionModel");
const mongoose = require("mongoose");

// get all Brands
const getBrands = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Brands = await brandModel.find({});

  res.status(200).json(Brands);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};

// get a single Brand
const getBrand = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Brand" });
  }

  const Brand = await brandModel.findById(id);

  if (!Brand) {
    return res.status(404).json({ error: "No such Brand" });
  }

  res.status(200).json(Brand);
};

// create a new Brand
const createBrand = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { brand } = req.body;
  let emptyFields = [];

  if (!brand) {
    emptyFields.push("brand");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  const brandLower = brand.toUpperCase();
  const duplicated = await brandModel.find({ brand: brandLower });
  if (duplicated.length > 0) {
    return res.status(400).json({ error: "Brand Already Exists!" });
  }
  // add to the database
  try {
    const newBrand = await brandModel.create({ brand: brandLower });
    res.status(200).json({ brand: newBrand, method: "create" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Brand
const deleteBrand = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such brand" });
  }

  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand) {
    return res.status(400).json({ error: "No such brand" });
  }
  const models = await modelModel.find({ brand: brand._id });
  models.forEach(async (model) => {
    const versions = await versionModel.find({ model: model._id });
    versions.forEach(async (version) => {
      await versionModel.findByIdAndDelete(version._id);
    });
    await modelModel.findByIdAndDelete(model._id);
  });

  res.status(200).json({ brand: brand, method: "delete" });
};

// update a Brand
const updateBrand = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such brand" });
  }
  if (req.body.brand) {
    req.body.brand = req.body.brand.toUpperCase();
    const duplicated = await brandModel.find({ brand: req.body.brand });
    if (duplicated.length > 0) {
      return res.status(400).json({ error: "Brand Already Exists!" });
    }
  }
  const newBrand = await brandModel.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (!newBrand) {
    return res.status(400).json({ error: "No such brand" });
  }

  res.status(200).json({ brand: newBrand, method: "update" });
};

module.exports = {
  getBrands,
  getBrand,
  createBrand,
  deleteBrand,
  updateBrand,
  getPermissions,
};
