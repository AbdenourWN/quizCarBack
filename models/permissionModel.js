const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const permissionModel = new Schema(
  {
    Get: {
      type: Boolean,
      required: true,
    },
    Post: {
      type: Boolean,
      required: true,
    },
    Delete: {
      type: Boolean,
      required: true,
    },
    Patch: {
      type: Boolean,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
    feature: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Feature",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionModel);
