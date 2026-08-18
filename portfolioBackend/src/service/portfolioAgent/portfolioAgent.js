const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createAgent, toolStrategy } = require("langchain");
const portfolioTool = require("../../tools/portfolioTool");
const { z } = require("zod");
const { responseSchema } = require("../../utils/responseSchema");


const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
  maxOutputTokens: 2048,
});

const tool =[portfolioTool];
const agent = createAgent({
  model,
  tools: tool,
  systemPrompt: `
You are a portfolio analysis AI assistant.

You are given a user's portfolio data.

Your job is to answer the user's question using the portfolio data.

Rules:

1. Use the portfolio data whenever the question requires it.
2. Perform calculations when necessary.
3. Do not invent portfolio information.
4. If the required information is not available, clearly say so.
5. Give a concise but useful answer.

Portfolio data will be provided with each request.
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