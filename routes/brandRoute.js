const express = require("express");
const {
  getBrand,
  getBrands,
  createBrand,
  deleteBrand,
  updateBrand,
  getPermissions
} = require("../controllers/brandController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use((req, res, next) => {
  requireAuth(req, res, next, "brand");
});

// GET all brands
router.get("/", getBrands);

//GET Permissions
router.get("/permissions", getPermissions);

// GET a single brand
router.get("/:id", getBrand);

// POST a new brand
router.post("/", createBrand);

// DELETE a brand
router.delete("/:id", deleteBrand);

// UPDATE a brand
router.patch("/:id", updateBrand);
module.exports = router;
