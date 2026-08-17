const express = require("express");

const PortfolioDataController = require("./portfolioData");

const router = express.Router();

router.get("/getData", PortfolioDataController.getPortfolioData);

// Other routes
// router.get("/data", ...);
// router.use("/insights", ...);

module.exports = router;