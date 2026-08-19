const express = require("express");

const PortfolioDataController = require("./portfolioData/portfolioData");
const PortfolioInsightsController = require("./portfolioinsights/portfolioinsights");
const router = express.Router();

router.get("/getData", PortfolioDataController.getPortfolioData);
router.post("/insights", PortfolioInsightsController.getInsights);


module.exports = router;