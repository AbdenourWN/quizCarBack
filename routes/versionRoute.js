const express = require("express");
const {
  getVersions,
  getVersion,
  createVersion,
  deleteVersion,
  updateVersion,
  getPermissions,
} = require("../controllers/versionController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "version");
});

// GET all versions
router.get("/", getVersions);

//GET Permissions
router.get("/permissions", getPermissions);

// GET a single version
router.get("/:id", getVersion);

// POST a new version
router.post("/", createVersion);

// DELETE a version
router.delete("/:id", deleteVersion);

// UPDATE a version
router.patch("/:id", updateVersion);
module.exports = router;
