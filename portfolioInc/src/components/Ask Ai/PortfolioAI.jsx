import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
        let errorData = {};

        try {
          errorData = await res.json();
        } catch {
          errorData = {};
        }

        console.log("API error:", errorData);

        if (res.status === 429) {
          throw new Error(
            errorData.message ||
              "AI rate limit reached. Please try again shortly."
          );
        }

        throw new Error(
          errorData.message ||
            "Failed to generate portfolio insights"
        );
      }

      const result = await res.json();

      console.log("AI response:", result);

      if (!result.success) {
        throw new Error(
          result.error ||
            "Unable to generate portfolio insights"
        );
      }

      console.log("result.data >>>>>>>>>>>>", result.data);

      setResponse(result.data);
    } catch (err) {
      console.error("Portfolio AI error:", err);

      setError(
        err?.message ||
          "Something went wrong while generating insights."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePrompt = (value) => {
    setPrompt(value);
  };

  return (
    <div className="portfolio-ai-page">
      <div className="portfolio-ai-container">

        <header className="portfolio-ai-header">
          <div className="brand-icon">✦</div>

          <div>
            <h1>Portfolio AI</h1>
            <p>Intelligent insights for your investments</p>
          </div>
        </header>

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


        {!response && !loading && (
          <div className="example-prompts">
            <span>Try asking:</span>

            <button
              type="button"
              onClick={() =>
                handleExamplePrompt(
                  "What happens to my portfolio if my crypto holdings lose 30%?"
                )
              }
            >
              Crypto risk
            </button>

            <button
              type="button"
              onClick={() =>
                handleExamplePrompt(
                  "Is my portfolio well diversified?"
                )
              }
            >
              Diversification
            </button>

            <button
              type="button"
              onClick={() =>
                handleExamplePrompt(
                  "Which are my biggest concentration risks?"
                )
              }
            >
              Concentration
            </button>

            <button
              type="button"
              onClick={() =>
                handleExamplePrompt(
                  "Show me my biggest gainers and losers."
                )
              }
            >
              Performance
            </button>
          </div>
        )}


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


        {error && (
          <div className="error-card">
            <strong>Something went wrong</strong>

            <p>{error}</p>
          </div>
        )}


        {!loading && response && (
          <section className="ai-response">

            <div className="response-header">
              <span className="response-label">
                Portfolio Analysis
              </span>

              <h2>
                {response.title || "Portfolio Analysis"}
              </h2>

              {response.summary && (
                <p>{response.summary}</p>
              )}
            </div>

            {/* Dynamic Sections */}

            <div className="response-sections">
              {Array.isArray(response.sections) &&
                response.sections.map((section, index) => (
                  <SectionRenderer
                    key={`${section.type || "section"}-${index}`}
                    section={section}
                  />
                ))}
            </div>

            <div className="follow-up">
              <p>Explore your portfolio further</p>

              <button
                type="button"
                onClick={() =>
                  handleExamplePrompt(
                    "What are the biggest risks in my portfolio?"
                  )
                }
              >
                Analyze my portfolio risks →
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExamplePrompt(
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


function SectionRenderer({ section }) {
  if (!section || typeof section !== "object") {
    return null;
  }

  const data = parseSectionData(section.data);

  switch (section.type) {
    case "metrics":
      return (
        <MetricsSection
          title={section.title}
          data={data}
        />
      );

    case "pie_chart":
      return (
        <PieChartSection
          title={section.title}
          data={data}
        />
      );

    case "table":
      return (
        <TableSection
          title={section.title}
          data={data}
        />
      );

    case "insight":
      return (
        <InsightSection
          title={section.title}
          data={data}
        />
      );

    case "recommendation":
      return (
        <RecommendationSection
          title={section.title}
          data={data}
        />
      );

    default:
      return (
        <FallbackSection
          title={section.title}
          data={data}
        />
      );
  }
}

function parseSectionData(data) {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data !== "string") {
    return data;
  }

  const trimmedData = data.trim();

  if (!trimmedData) {
    return null;
  }

  try {
    return JSON.parse(trimmedData);
  } catch (error) {
    console.warn(
      "Could not parse section data as JSON:",
      data
    );

    return data;
  }
}


function MetricsSection({ title, data }) {
  if (!Array.isArray(data)) {
    return (
      <section className="response-section">
        {title && <h3>{title}</h3>}

        <div className="metric-card">
          <div className="metric-value">
            {formatDisplayValue(data)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="response-section metrics-section">
      {title && <h3>{title}</h3>}

      <div className="metrics-grid">
        {data.map((metric, index) => (
          <div
            className="metric-card"
            key={index}
          >
            <div className="metric-card-header">
              <span>
                {metric?.label || "Metric"}
              </span>

              <div className="metric-icon">
                ↗
              </div>
            </div>

            <div className="metric-value">
              {formatDisplayValue(
                metric?.formattedValue ??
                  metric?.value
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PieChartSection({ title, data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <section className="response-section">
        {title && <h3>{title}</h3>}

        <div className="empty-section">
          No chart data available.
        </div>
      </section>
    );
  }

  const validData = data
    .map((item) => ({
      category:
        item?.category ||
        item?.label ||
        item?.name ||
        "Unknown",

      value: Number(item?.value) || 0,
    }))
    .filter((item) => item.value > 0);

  if (validData.length === 0) {
    return (
      <section className="response-section">
        {title && <h3>{title}</h3>}

        <div className="empty-section">
          No valid chart data available.
        </div>
      </section>
    );
  }

  return (
    <section className="response-section chart-section">
      {title && <h3>{title}</h3>}

      <div className="chart-container">
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>
            <Pie
              data={validData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={115}
              innerRadius={55}
              paddingAngle={2}
              label
            >
              {validData.map((_, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                formatCurrency(value)
              }
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}


function TableSection({ title, data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <section className="response-section">
        {title && <h3>{title}</h3>}

        <div className="empty-section">
          No table data available.
        </div>
      </section>
    );
  }

  const columns = getTableColumns(data);

  return (
    <section className="response-section table-section">
      {title && <h3>{title}</h3>}

      <div className="table-wrapper">
        <table className="portfolio-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>
                  {formatColumnName(column)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`}>
                    {formatDisplayValue(row?.[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


function getTableColumns(data) {
  const columns = [];

  data.forEach((row) => {
    if (!row || typeof row !== "object") {
      return;
    }

    Object.keys(row).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  });

  return columns;
}


function InsightSection({ title, data }) {
  const items = normalizeStringArray(data);

  return (
    <section className="response-section insight-section">
      {title && <h3>{title}</h3>}

      {items.length === 0 ? (
        <div className="empty-section">
          No insights available.
        </div>
      ) : (
        <div className="insight-list">
          {items.map((item, index) => (
            <div
              className="insight-item"
              key={index}
            >
              <div className="insight-icon">
                !
              </div>

              <p>{item}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


function RecommendationSection({
  title,
  data,
}) {
  const items = normalizeStringArray(data);

  return (
    <section className="response-section recommendation-section">
      {title && <h3>{title}</h3>}

      {items.length === 0 ? (
        <div className="empty-section">
          No recommendations available.
        </div>
      ) : (
        <div className="recommendation-list">
          {items.map((item, index) => (
            <div
              className="recommendation-item"
              key={index}
            >
              <div className="recommendation-number">
                {index + 1}
              </div>

              <p>{item}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


function FallbackSection({ title, data }) {
  return (
    <section className="response-section">
      {title && <h3>{title}</h3>}

      <div className="fallback-content">
        {typeof data === "string" ? (
          <p>{data}</p>
        ) : (
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}


function normalizeStringArray(data) {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (
          item &&
          typeof item === "object"
        ) {
          return (
            item.description ||
            item.text ||
            item.message ||
            JSON.stringify(item)
          );
        }

        return String(item);
      })
      .filter(Boolean);
  }

  if (typeof data === "string") {
    return [data];
  }

  if (data !== null && data !== undefined) {
    return [String(data)];
  }

  return [];
}


function formatDisplayValue(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return JSON.stringify(value);
}


function formatColumnName(column) {
  if (!column) {
    return "";
  }

  return column
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}


function formatCurrency(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return value;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
}