const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleModel = new Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleModel);
