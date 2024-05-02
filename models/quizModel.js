const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quizModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Fast", "Slow"],
    },
    result: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    quizQuestions: {
      type: [
        {
          question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
          },
          response: {
            type: Schema.Types.Mixed,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizModel);
