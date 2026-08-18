// const portfolioData = require("../../service/data.json");
const { runPortfolioAgent } = require("../../service/portfolioAgent/portfolioAgent");

class PortfolioInsightsController {
  static async getInsights(req, res) {
    try {
      const userPrompt = req.body.prompt;

      console.log("Request body:", userPrompt);

      const result = await runPortfolioAgent(userPrompt);
        console.log("Portfolio insights generated:", result);
      return res.status(200).json({
        result,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to generate portfolio insights",
        error: error.message,
      });
    }
  }
}

module.exports = PortfolioInsightsController;