const express = require("express");
const { loginUser, signupUser } = require("../controllers/userController");

const router = express.Router();

// POST a new Auth
router.post("/login", loginUser);

// POST a new Auth
router.post("/signup", signupUser);

module.exports = router;
