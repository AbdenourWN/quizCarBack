const featureModel = require("../models/featureModel");
const mongoose = require("mongoose");

// get all Features
const getFeatures = async (req, res) => {
  if (req.user.role.role !== "admin") {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Features = await featureModel.find({});

  res.status(200).json(Features);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};

// get a single Feature
const getFeature = async (req, res) => {
  if (!req.user.role.role !== "admin") {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Feature" });
  }

  const Feature = await featureModel.findById(id);

  if (!Feature) {
    return res.status(404).json({ error: "No such Feature" });
  }

  res.status(200).json(Feature);
};

// create a new Feature
/* const createFeature = async (req, res) => {
  const { feature } = req.body;

  // add to the database
  try {
    const newFeature = await featureModel.create({ feature });
    res.status(200).json(newFeature);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 */
module.exports = {
  getFeatures,
  getFeature,
  getPermissions
 /*  createFeature, */
};
