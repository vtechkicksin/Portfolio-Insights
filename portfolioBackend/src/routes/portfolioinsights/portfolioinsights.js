// const portfolioData = require("../../service/data.json");
const { runPortfolioAgent } = require("../../service/portfolioAgent/portfolioAgent");

class PortfolioInsightsController {
  static async getInsights(req, res) {
    try {
      const userPrompt = req.body.prompt;

      console.log("Request body:", userPrompt);

      const result = await runPortfolioAgent(userPrompt);
        console.log("Portfolio insights generated:", result);

      const structuredResponse = result?.structuredResponse;

        if (!structuredResponse) {
        return res.status(500).json({
        success: false,
        error: "Agent did not return a structured response",
      });
    }

    if (!structuredResponse.success) {
      return res.status(400).json(structuredResponse);
    }

    const data = structuredResponse.data;

    if (!data) {
      return res.status(500).json({
        success: false,
        error: "Structured response does not contain data",
      });
    }
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