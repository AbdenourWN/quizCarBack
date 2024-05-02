const quizModel = require("../models/quizModel");
const mongoose = require("mongoose");

// get all Quizs
const getQuizs = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const Quizs = await quizModel.find({});

  res.status(200).json(Quizs);
};
const getPermissions = (req, res) => {
  return res.status(200).json(req.user.permission);
};
// get a single Quiz
const getQuiz = async (req, res) => {
  if (!req.user.permission.Get) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Quiz" });
  }

  const Quiz = await quizModel.findById(id);

  if (!Quiz) {
    return res.status(404).json({ error: "No such Quiz" });
  }

  res.status(200).json(Quiz);
};
const getMyQuizzes = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Quiz" });
  }

  const Quiz = await quizModel.find({ createdBy: id });

  if (!Quiz) {
    return res.status(404).json({ error: "No such Quiz" });
  }

  res.status(200).json(Quiz);
};

// create a new Quiz
const createQuiz = async (req, res) => {
  if (!req.user.permission.Post) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { name, type, quizQuestions, result, createdBy } = req.body;
  let emptyFields = [];

  if (!name) {
    emptyFields.push("name");
  }
  if (!type) {
    emptyFields.push("type");
  }
  if (!quizQuestions) {
    emptyFields.push("quizQuestions");
  }
  if (!result) {
    emptyFields.push("result");
  }
  if (!createdBy) {
    emptyFields.push("createdBy");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  // add to the database
  try {
    const newQuiz = await quizModel.create({
      name,
      type,
      quizQuestions,
      result,
      createdBy,
    });
    res.status(200).json({ quiz: newQuiz, method: "create" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Quiz
const deleteQuiz = async (req, res) => {
  if (!req.user.permission.Delete) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Quiz" });
  }

  const Quiz = await quizModel.findByIdAndDelete(id);

  if (!Quiz) {
    return res.status(400).json({ error: "No such Quiz" });
  }
  res.status(200).json({ quiz: Quiz, method: "delete" });
};

// update a Quiz
const updateQuiz = async (req, res) => {
  if (!req.user.permission.Patch) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Quiz" });
  }
  if (req.body.type) {
    return res.status(400).json({ error: "Cannot Update Type Of Quiz" });
  }
  if (req.body.createdBy) {
    return res.status(400).json({ error: "Cannot Update createdBy Of Quiz" });
  }
  const newQuiz = await quizModel.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (!newQuiz) {
    return res.status(400).json({ error: "No such Quiz" });
  }

  res.status(200).json({ quiz: newQuiz, method: "update" });
};

module.exports = {
  getQuizs,
  getQuiz,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getPermissions,
  getMyQuizzes
};
