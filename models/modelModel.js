const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    model: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Model", modelSchema);
