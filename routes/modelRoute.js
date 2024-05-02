const express = require("express");
const {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel,
  getPermissions
} = require("../controllers/modelController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "model");
});

// GET all models
router.get("/", getModels);

//GET Permissions
router.get("/permissions", getPermissions);

// GET a single model
router.get("/:id", getModel);

// POST a new model
router.post("/", createModel);

// DELETE a model
router.delete("/:id", deleteModel);

// UPDATE a model
router.patch("/:id", updateModel);
module.exports = router;
