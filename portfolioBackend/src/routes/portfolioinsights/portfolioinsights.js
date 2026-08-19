const { runPortfolioAgent } = require("../../service/portfolioAgent/portfolioAgent");

class PortfolioInsightsController {
  static async getInsights(req, res) {
    try {
      const userPrompt = req.body.prompt;

      console.log("Request body:", userPrompt);

      const result = await runPortfolioAgent(userPrompt);

      console.log("Portfolio insights generated:", result);

      const structuredResponse = result;

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

      console.log("data is >>>>>>", data);

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      console.error("Portfolio insights error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to generate portfolio insights",
        error: error.message,
      });
    }
  }
}

module.exports = PortfolioInsightsController;