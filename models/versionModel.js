const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const versionModel = new Schema(
  {
    model: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Model",
    },
    version: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Version", versionModel);
