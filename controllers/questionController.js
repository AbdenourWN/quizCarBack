const questionModel = require("../models/questionModel");
const mongoose = require("mongoose");

// get all Questions
const getQuestions = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Questions = await questionModel.find({}).sort({ createdAt: 1 });

  res.status(200).json(Questions);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};
const getFastQuestions = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Questions = await questionModel.find({});
  const needed = [
    "Marque",
    "Modele",
    "Version",
    "Kilometrage",
    "Puissance fiscale (cv)",
    "Cylindre (ML)",
    "Age",
  ];
  const ques = Questions.filter((question) =>
    needed.includes(question.question)
  );

  res.status(200).json(ques);
};
// get a single Question
const getQuestion = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Question" });
  }

  const Question = await questionModel.findById(id);

  if (!Question) {
    return res.status(404).json({ error: "No such Question" });
  }

  res.status(200).json(Question);
};

// create a new Question
/* const createQuestion = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { question, subQuestions, type } = req.body;
  let emptyFields = [];
  let types = ["Dropdown", "Text", "SubQuestions", "Number"];

  if (!type) {
    emptyFields.push("type");
  }
  if (!question) {
    emptyFields.push("question");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  if (!types.includes(type)) {
    return res.status(400).json({
      error:
        "Type Must Be One Of These Values ['Dropdown', 'Text', 'SubQuestions', 'Number']",
    });
  }
  const questionLower = question.toLowerCase();
  const ques = await questionModel.find({ question: questionLower });
  if (ques.length > 0) {
    return res.status(400).json({ error: "Question Already Exists" });
  }

  if (type === "SubQuestions" && !(subQuestions && subQuestions.length > 0)) {
    return res.status(400).json({
      error: "subQuestions Needs To Be Filled With Type 'SubQuestions'",
    });
  }
  if (type !== "SubQuestions" && subQuestions && subQuestions.length > 0) {
    return res.status(400).json({
      error: "subQuestions Needs To Be Filled With Type 'SubQuestions'",
    });
  }
  if (subQuestions && subQuestions.length > 0) {
    subQuestions.forEach(async (question) => {
      if (!mongoose.Types.ObjectId.isValid(question)) {
        return res
          .status(404)
          .json({ error: "subQuestions Must Be An Array of Question IDs" });
      }
      const questionExist = await questionModel.findOne({ _id: question });
      if (!questionExist) {
        return res.status(404).json({ error: "Question Does Not Exist" });
      }
    });
  }

  // add to the database
  try {
    let newType;
    subQuestions && subQuestions.length > 0
      ? (newType = "SubQuestions")
      : (newType = type);
    const newQuestion = await questionModel.create({
      question: questionLower,
      subQuestions,
      type: newType,
    });
    res.status(200).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; */

// delete a Question
/* const deleteQuestion = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Question" });
  }

  const Question = await questionModel.findByIdAndDelete(id);

  if (!Question) {
    return res.status(400).json({ error: "No such Question" });
  }

  res.status(200).json(Question);
}; */

// update a Question
/* const updateQuestion = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Question" });
  }
  if (req.body.question) {
    req.body.question = req.body.question.toLowerCase();
    const ques = await questionModel.find({ ...req.body });
    if (ques.length > 0) {
      return res.status(400).json({ error: "Question Already Exists" });
    }
  }
  const newQuestion = await questionModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    { new: true }
  );

  if (!newQuestion) {
    return res.status(400).json({ error: "No such Question" });
  }

  res.status(200).json(newQuestion);
}; */

module.exports = {
  getQuestions,
  getQuestion,
  getFastQuestions,
  getPermissions,
  /* createQuestion, */
  /*   deleteQuestion,*/
  /* updateQuestion, */
};
