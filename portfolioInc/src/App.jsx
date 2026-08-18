import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioDashboard from "./components/Dashboard/PortfolioDashboard";
import PortfolioAI from "./components/Ask Ai/PortfolioAI";

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getData"
        );
        setPortfolioData(response.data.portfoliodata);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setError("Failed to fetch portfolio data");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return <div>Loading portfolio...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PortfolioDashboard
              portfolioData={portfolioData}
            />
          }
        />

        <Route
          path="/portfolio/ai"
          element={
            <PortfolioAI
              portfolioData={portfolioData}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;