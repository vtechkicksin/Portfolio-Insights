const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createAgent, toolStrategy } = require("langchain");
const portfolioTool = require("../../tools/portfolioTool");
const { z } = require("zod");
const { responseSchema } = require("../../utils/responseSchema");


const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
  maxOutputTokens: 4096,
});

const tool =[portfolioTool];
const agent = createAgent({
  model,
  tools: tool,
  systemPrompt: `
You are an AI portfolio analysis agent.

Your job is to analyze the user's portfolio and answer
portfolio-related questions using the available tools.

When answering hypothetical or scenario-based portfolio questions:

1. Identify which part of the portfolio is affected.
2. Retrieve all portfolio information required to perform the analysis.
3. Consider the impact on the entire portfolio, not just the affected asset.
4. Calculate the absolute gain or loss.
5. Calculate the percentage impact on the total portfolio.
6. Use the numerical values returned by the portfolio tool for calculations.
7. Do not make assumptions about portfolio values that are not available.
8. Clearly explain the scenario and provide the relevant calculated metrics.

For example, if the user asks:
"What happens if the stock market falls by 20%?"

You should:
- Retrieve the current stock value.
- Retrieve the total portfolio value.
- Calculate the potential stock loss.
- Calculate the resulting total portfolio value.
- Calculate the percentage impact on the entire portfolio.

Use the portfolio_data tool whenever portfolio information is required.
`,
responseFormat: toolStrategy(responseSchema),
});

async function runPortfolioAgent(userPrompt) {
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: userPrompt
      },
    ],
  });
  console.log("Agent result:", result);
  return result.structuredResponse;
}

module.exports = {
  runPortfolioAgent,
};