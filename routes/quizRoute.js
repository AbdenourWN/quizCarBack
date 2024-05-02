const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getQuiz,
  getQuizs,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getPermissions,
  getMyQuizzes,
} = require("../controllers/quizController");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "quiz");
});

// GET all quizzes
router.get("/", getQuizs);

//GET Permissions
router.get("/permissions", getPermissions);

// GET a single quiz
router.get("/:id", getQuiz);

router.get("/me/:id", getMyQuizzes);

// POST a new quiz
router.post("/", createQuiz);

// DELETE a quiz
router.delete("/:id", deleteQuiz);

// UPDATE a quiz
router.patch("/:id", updateQuiz);
module.exports = router;
