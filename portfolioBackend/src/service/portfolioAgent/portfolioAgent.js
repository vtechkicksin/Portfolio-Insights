const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");

const {
  AgentExecutor,
  createToolCallingAgent,
} = require("langchain/agents");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
  maxOutputTokens: 2048,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a portfolio analysis AI assistant.

You are given a user's portfolio data.

Your job is to answer the user's question using the portfolio data.

Rules:

1. Use the portfolio data whenever the question requires it.
2. Perform calculations when necessary.
3. Do not invent portfolio information.
4. If the required information is not available, clearly say so.
5. Give a concise but useful answer.

Portfolio data:

{portfolioData}
`,
  ],

  ["human", "{input}"],

  new MessagesPlaceholder("agent_scratchpad"),
]);

let agentExecutor;

// Initialize the agent
async function initializeAgent() {
  const agent = await createToolCallingAgent({
    llm: model,
    tools: [],
    prompt,
  });

  agentExecutor = new AgentExecutor({
    agent,
    tools: [],
  });
}

// Run the portfolio agent
async function runPortfolioAgent(userPrompt, portfolioData) {
  if (!agentExecutor) {
    await initializeAgent();
  }

  const result = await agentExecutor.invoke({
    input: userPrompt,
    portfolioData: JSON.stringify(portfolioData),
  });

  return result.output;
}

module.exports = {
  runPortfolioAgent,
};