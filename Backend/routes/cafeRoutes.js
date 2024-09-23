const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");


router.get("/cafe/:id", cafeController.getCafe);

// GET /cafes?location=<location>
router.get("/cafes", cafeController.getAllCafes);

// POST /cafe
router.post("/cafe", cafeController.createCafe);

// PUT /cafe/:id
router.put("/cafe/:id", cafeController.updateCafe);

// DELETE /cafe/:id
router.delete("/cafe/:id", cafeController.deleteCafe);

module.exports = router;
