const express = require("express");
const {
  getRoles,
  getRole,
  createRole,
  deleteRole,
  updateRole,
  getPermissions
} = require("../controllers/roleController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "role");
});

// GET all Roles
router.get("/", getRoles);

//GET Permissions
router.get("/permissions", getPermissions);

// GET a single Role
router.get("/:id", getRole);

// POST a new Role
router.post("/", createRole);

// DELETE a Role
router.delete("/:id", deleteRole);

// UPDATE a Role
router.patch("/:id", updateRole);
module.exports = router;
