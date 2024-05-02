const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  getPermissions,
  updateOldUser,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "user");
});

// GET all Users
router.get("/", getUsers);

//GET Permissions
router.get("/permissions", getPermissions);

router.get("/me", getMe);

// GET a single User
router.get("/:id", getUser);

// POST a new User
router.post("/", createUser);

// DELETE a User
router.delete("/:id", deleteUser);

// UPDATE a User
router.patch("/:id", updateUser);

router.patch("/me/:id", updateOldUser);

module.exports = router;
