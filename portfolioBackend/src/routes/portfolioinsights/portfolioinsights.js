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


      return res.status(200).json({
        success: true,
        data,
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
        message: "Failed to generate portfolio insights",
        error: error.message,
      });
    }
  }
}

module.exports = PortfolioInsightsController;