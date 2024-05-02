const express = require("express");
const {
  getPermissions,
  getPermission,
/*   createPermission, */
  deletePermission,
  updatePermission,
} = require("../controllers/permissionController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "permission");
});

// GET all Permissions
router.get("/", getPermissions);

// GET a single Permission
router.get("/:id", getPermission);

// POST a new Permission
/* router.post("/", createPermission); */

// DELETE a Permission
router.delete("/:id", deletePermission);

// UPDATE a Permission
router.patch("/:id", updatePermission);
module.exports = router;
