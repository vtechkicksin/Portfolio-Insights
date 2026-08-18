import { useState } from "react";
import "./PortfolioAI.css";

export default function PortfolioAI() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!prompt.trim()) return;
    console.log("Sending prompt:", prompt.trim());
  try {
    const response = await fetch("http://localhost:3000/api/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
      }),
    });
    
    // if (!response.ok) {
    //   throw new Error("Failed to send prompt");
    // }

    // const data = await response.json();

    // console.log("AI response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className="portfolio-ai-page">
      <form
        className="ai-search-container"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything about your portfolio..."
        />

        <button type="submit" disabled={!prompt.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}