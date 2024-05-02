const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionModel = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Dropdown", "Text", "Number"],
    },
    subQuestions: {
      type: [Schema.Types.ObjectId],
      ref: "Question",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionModel);
