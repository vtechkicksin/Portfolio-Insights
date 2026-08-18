const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const portfolioData = require("./data.json");

const portfolioTool = tool(
  async ({ query }) => {
    console.log("Portfolio tool called with:", query);

    // For now, return the complete portfolio.
    // Later we can make this smarter and return only
    // the relevant portion of the portfolio.

    return JSON.stringify(portfolioData);
  },
  {
    name: "portfolio_data",
    description: `
      Use this tool whenever the user's question requires
      information about their portfolio.

      The portfolio contains:
      - stocks
      - mutual funds
      - crypto
      - real estate
      - cash
      - invested values
      - current values
      - profit/loss
      - sectors
      - quantities
      - asset allocation

      Use this tool to retrieve the user's portfolio information
      before answering portfolio-related questions.
    `,
    schema: z.object({
      query: z
        .string()
        .describe("What portfolio information is needed"),
    }),
  }
);

module.exports = portfolioTool;