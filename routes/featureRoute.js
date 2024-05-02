const express = require("express");
const {
  getFeatures,
  getFeature,
  getPermissions
  /* createFeature, */
} = require("../controllers/featureController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "feature");
});
// GET all Features
router.get("/", getFeatures);

//GET Permissions
router.get("/permissions", getPermissions);

// GET a single Feature
router.get("/:id", getFeature);

/* // POST a new Feature
router.post("/", createFeature); */
module.exports = router;
