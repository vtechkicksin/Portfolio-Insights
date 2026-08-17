const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const clothingListingRoutes = require("./clothingListingRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/listings", clothingListingRoutes);
router.use("/", userRoutes);

module.exports = router;
