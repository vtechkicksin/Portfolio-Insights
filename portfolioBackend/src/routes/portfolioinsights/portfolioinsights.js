const { runPortfolioAgent } = require("../../service/portfolioAgent/portfolioAgent");

class PortfolioInsightsController {
  static async getInsights(req, res) {
    try {
      const { prompt } = req.body;
      if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Prompt must be a non-empty string",
        });
      }

      const userPrompt = prompt.trim();

      const result = await runPortfolioAgent(userPrompt);
      if (!result) {
        throw new Error("Agent returned no result");
      }

      if (!result.success) {
        return res.status(400).json(result);
      }

      if (!result.data) {
        throw new Error(
          "Agent returned a successful response without data"
        );
      }

      return res.status(200).json({
        success: true,
        data: result.data,
      });

    } catch (error) {
      console.error("Portfolio insights error:", error);

      if (error?.status === 429 || error?.code === 429) {
        return res.status(429).json({
          success: false,
          errorType: "RATE_LIMIT",
          message:
            "AI usage limit has been reached. Please try again shortly.",
          retryAfter: 51,
        });
      }

      return res.status(500).json({
        success: false,
        errorType: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate portfolio insights",
      });
    }
  }
}

module.exports = PortfolioInsightsController;