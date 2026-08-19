import { useState } from "react";
import "./PortfolioAI.css";

export default function PortfolioAI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://localhost:3000/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate portfolio insights");
      }

      const result = await res.json();

      console.log("AI response:", result);

      if (!result.success) {
        throw new Error(
          result.error || "Unable to generate portfolio insights"
        );
      }
      console.log("result.data.data>>>>>>>>>>",result.data);
      setResponse(result.data);
    } catch (err) {
      console.error("Portfolio AI error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-ai-page">
      <div className="portfolio-ai-container">

        {/* Header */}
        <header className="portfolio-ai-header">
          <div className="brand-icon">✦</div>

          <div>
            <h1>Portfolio AI</h1>
            <p>Intelligent insights for your investments</p>
          </div>
        </header>

        {/* Hero */}
        {!response && !loading && (
          <section className="hero-section">
            <div className="hero-badge">
              AI-powered portfolio analysis
            </div>

            <h2>
              Ask anything about your
              <span> portfolio.</span>
            </h2>

            <p>
              Analyze your investments, understand risk,
              simulate scenarios and discover opportunities.
            </p>
          </section>
        )}

        {/* Search */}
        <form
          className="ai-search-container"
          onSubmit={handleSubmit}
        >
          <div className="search-icon">
            ✦
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about your portfolio..."
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!prompt.trim() || loading}
          >
            {loading ? "Analyzing..." : "Ask"}
          </button>
        </form>

        {/* Example prompts */}
        {!response && !loading && (
          <div className="example-prompts">
            <span>Try asking:</span>

            <button
              type="button"
              onClick={() =>
                setPrompt(
                  "What happens to my portfolio if my crypto holdings lose 30%?"
                )
              }
            >
              Crypto risk
            </button>

            <button
              type="button"
              onClick={() =>
                setPrompt(
                  "Is my portfolio well diversified?"
                )
              }
            >
              Diversification
            </button>

            <button
              type="button"
              onClick={() =>
                setPrompt(
                  "Which are my biggest concentration risks?"
                )
              }
            >
              Concentration
            </button>

            <button
              type="button"
              onClick={() =>
                setPrompt(
                  "Show me my biggest gainers and losers."
                )
              }
            >
              Performance
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-card">
            <div className="loading-spinner"></div>

            <div>
              <h3>Analyzing your portfolio...</h3>

              <p>
                Calculating insights based on your investments.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-card">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {/* AI Response */}
        {!loading && response && (
          <section className="ai-response">

            <div className="response-header">
              <span className="response-label">
                Portfolio Analysis
              </span>

              <h2>{response.title}</h2>

              <p>{response.summary}</p>
            </div>

            <div className="metrics-grid">
              {response.sections?.map((section, index) => (
                <MetricCard
                  key={index}
                  section={section}
                />
              ))}
            </div>

            <div className="follow-up">
              <p>Explore your portfolio further</p>

              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    "What are the biggest risks in my portfolio?"
                  )
                }
              >
                Analyze my portfolio risks →
              </button>

              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    "Is my portfolio well diversified?"
                  )
                }
              >
                Check diversification →
              </button>
            </div>

          </section>
        )}
      </div>
    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({ section }) {
  const value = extractValue(section.data);

  return (
    <div className="metric-card">

      <div className="metric-card-header">
        <span>{section.title}</span>

        <div className="metric-icon">
          ↗
        </div>
      </div>

      <div className="metric-value">
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   EXTRACT VALUE
========================================================= */

function extractValue(data) {
  if (!data) {
    return "-";
  }

  if (typeof data === "object") {
    if (data.formattedValue) {
      return data.formattedValue;
    }

    if (data.value !== undefined) {
      return data.value;
    }

    return "-";
  }

  const text = String(data)
    .replace(/\n/g, "")
    .trim();

  const colonIndex = text.indexOf(":");

  if (colonIndex !== -1) {
    return text.substring(colonIndex + 1).trim();
  }

  return text;
}