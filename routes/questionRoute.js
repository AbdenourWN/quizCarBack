const express = require("express");
const {
  getQuestion,
  getQuestions,
  /* createQuestion, */
  getFastQuestions,
  getPermissions
  /* deleteQuestion, */
  /*   updateQuestion,
   */
} = require("../controllers/questionController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "question");
});

// GET all questions
router.get("/", getQuestions);

//GET Permissions
router.get("/permissions", getPermissions);

router.get("/fast", getFastQuestions);

// GET a single question
router.get("/:id", getQuestion);

// POST a new question
/* router.post("/", createQuestion); */

// DELETE a question
/* router.delete("/:id", deleteQuestion);
 */
// UPDATE a question
/* router.patch("/:id", updateQuestion); */
module.exports = router;
