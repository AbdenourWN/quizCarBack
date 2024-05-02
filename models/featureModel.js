const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const featureModel = new Schema(
  {
    feature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", featureModel);
