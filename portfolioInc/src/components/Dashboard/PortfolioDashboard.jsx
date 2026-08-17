import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "./PortfolioDashboard.css";


const ALLOCATION_COLORS = [
  "#2563eb", // Stocks - Blue
  "#16a34a", // Mutual Funds - Green
  "#f59e0b", // Crypto - Orange
  "#8b5cf6", // Real Estate - Purple
  "#64748b", // Cash - Gray
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(value);

export default function PortfolioDashboard({ portfolioData }) {
  const [activeTab, setActiveTab] = useState("stocks");

  // IMPORTANT
  const { client, portfolio } = portfolioData;

  const allocationData = useMemo(
    () => [
      {
        name: "Stocks",
        value: portfolio.assetAllocation.stocks.currentValue,
      },
      {
        name: "Mutual Funds",
        value: portfolio.assetAllocation.mutualFunds.currentValue,
      },
      {
        name: "Crypto",
        value: portfolio.assetAllocation.crypto.currentValue,
      },
      {
        name: "Real Estate",
        value: portfolio.assetAllocation.realEstate.currentValue,
      },
      {
        name: "Cash",
        value: portfolio.assetAllocation.cash.value,
      },
    ],
    [portfolio]
  );

  const stockChartData = portfolio.stocks.holdings.map((stock) => ({
    name: stock.symbol,
    profitLoss: stock.profitLoss,
  }));

  return (
    <div className="portfolio-dashboard">

      {/* Header */}
      <div className="portfolio-header">
        <div>
          <p className="eyebrow">PORTFOLIO OVERVIEW</p>

          <h1>{client.name}'s Portfolio</h1>

          <p className="portfolio-id">
            Portfolio ID: {portfolio.portfolioId}
          </p>
        </div>

        <div className="header-actions">
          <button>Refresh</button>
          <button className="primary-btn">Ask AI</button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-grid">

        <SummaryCard
          title="Current Portfolio Value"
          value={formatCurrency(portfolio.currentPortfolioValue)}
        />

        <SummaryCard
          title="Total Invested"
          value={formatCurrency(portfolio.totalInvestedValue)}
        />

        <SummaryCard
          title="Total Profit / Loss"
          value={formatCurrency(portfolio.totalProfitLoss)}
          percentage={`${portfolio.totalProfitLossPercentage}%`}
          positive={portfolio.totalProfitLoss >= 0}
        />

        <SummaryCard
          title="Asset Classes"
          value="5"
          subtitle="Stocks, MF, Crypto, RE & Cash"
        />

      </div>

      {/* Charts */}
      <div className="dashboard-grid">

        {/* Asset Allocation */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Asset Allocation</h2>
              <p>Current portfolio distribution</p>
            </div>
          </div>

          <div className="allocation-chart">
            <ResponsiveContainer width="100%" height={330}>
              <PieChart>
                <Pie
                data={allocationData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                >
                {allocationData.map((entry, index) => (
                    <Cell
                    key={entry.name}
                    fill={ALLOCATION_COLORS[index]}
                    />
                ))}
                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Performance */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Stock Performance</h2>
              <p>Profit / loss by holding</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis
                tickFormatter={(value) =>
                  `₹${Math.abs(value / 1000)}K`
                }
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
              />
                <Bar
                dataKey="profitLoss"
                name="Profit / Loss"
                radius={[6, 6, 0, 0]}
                >
                {stockChartData.map((stock) => (
                    <Cell
                    key={stock.name}
                    fill={stock.profitLoss >= 0 ? "#16a34a" : "#dc2626"}
                    />
                ))}
                </Bar>
               {/* <Bar
                dataKey="profitLoss"
                name="Profit / Loss"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />  */}
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Asset Tabs */}
      <div className="asset-section">

        <div className="tabs">
          {[
            ["stocks", "Stocks"],
            ["mutualFunds", "Mutual Funds"],
            ["crypto", "Crypto"],
            ["realEstate", "Real Estate"],
            ["cash", "Cash"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={activeTab === key ? "tab active" : "tab"}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stocks */}
        {activeTab === "stocks" && (
          <AssetCard
            title="Stocks"
            invested={portfolio.stocks.totalInvestedValue}
            current={portfolio.stocks.currentValue}
            profitLoss={portfolio.stocks.totalProfitLoss}
          >
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Qty</th>
                    <th>Invested</th>
                    <th>Current Value</th>
                    <th>P/L</th>
                    <th>P/L %</th>
                  </tr>
                </thead>

                <tbody>
                  {portfolio.stocks.holdings.map((stock) => (
                    <tr key={stock.symbol}>

                      <td>
                        <div className="asset-name">
                          <strong>{stock.name}</strong>
                          <span>{stock.symbol}</span>
                        </div>
                      </td>

                      <td>{stock.sector}</td>

                      <td>{formatNumber(stock.quantity)}</td>

                      <td>
                        {formatCurrency(stock.investedValue)}
                      </td>

                      <td>
                        {formatCurrency(stock.currentValue)}
                      </td>

                      <td
                        className={
                          stock.profitLoss >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatCurrency(stock.profitLoss)}
                      </td>

                      <td
                        className={
                          stock.profitLossPercentage >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {stock.profitLossPercentage}%
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AssetCard>
        )}

        {/* Mutual Funds */}
        {activeTab === "mutualFunds" && (
          <AssetCard
            title="Mutual Funds"
            invested={portfolio.mutualFunds.totalInvestedValue}
            current={portfolio.mutualFunds.currentValue}
            profitLoss={portfolio.mutualFunds.totalProfitLoss}
          >
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th>Category</th>
                    <th>Units</th>
                    <th>Invested</th>
                    <th>Current NAV</th>
                    <th>Current Value</th>
                    <th>P/L</th>
                  </tr>
                </thead>

                <tbody>
                  {portfolio.mutualFunds.holdings.map((fund) => (
                    <tr key={fund.schemeName}>

                      <td>
                        <div className="asset-name">
                          <strong>{fund.schemeName}</strong>
                          <span>{fund.fundHouse}</span>
                        </div>
                      </td>

                      <td>{fund.category}</td>

                      <td>{fund.units}</td>

                      <td>
                        {formatCurrency(fund.investedValue)}
                      </td>

                      <td>
                        ₹{fund.currentNAV}
                      </td>

                      <td>
                        {formatCurrency(fund.currentValue)}
                      </td>

                      <td
                        className={
                          fund.profitLoss >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatCurrency(fund.profitLoss)}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AssetCard>
        )}

        {/* Crypto */}
        {activeTab === "crypto" && (
          <AssetCard
            title="Crypto"
            invested={portfolio.crypto.totalInvestedValue}
            current={portfolio.crypto.currentValue}
            profitLoss={portfolio.crypto.totalProfitLoss}
          >
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Quantity</th>
                    <th>Invested</th>
                    <th>Current Price</th>
                    <th>Current Value</th>
                    <th>P/L</th>
                  </tr>
                </thead>

                <tbody>
                  {portfolio.crypto.holdings.map((crypto) => (
                    <tr key={crypto.symbol}>

                      <td>
                        <div className="asset-name">
                          <strong>{crypto.name}</strong>
                          <span>{crypto.symbol}</span>
                        </div>
                      </td>

                      <td>{crypto.quantity}</td>

                      <td>
                        {formatCurrency(crypto.investedValue)}
                      </td>

                      <td>
                        {formatCurrency(crypto.currentPrice)}
                      </td>

                      <td>
                        {formatCurrency(crypto.currentValue)}
                      </td>

                      <td
                        className={
                          crypto.profitLoss >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatCurrency(crypto.profitLoss)}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AssetCard>
        )}

        {/* Real Estate */}
        {activeTab === "realEstate" && (
          <AssetCard
            title="Real Estate"
            invested={portfolio.realEstate.totalInvestedValue}
            current={portfolio.realEstate.currentValue}
            profitLoss={portfolio.realEstate.totalProfitLoss}
          >
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Purchase Value</th>
                    <th>Current Value</th>
                    <th>P/L</th>
                  </tr>
                </thead>

                <tbody>
                  {portfolio.realEstate.properties.map((property) => (
                    <tr key={property.propertyId}>

                      <td>{property.name}</td>

                      <td>{property.type}</td>

                      <td>{property.location}</td>

                      <td>
                        {formatCurrency(property.purchaseValue)}
                      </td>

                      <td>
                        {formatCurrency(property.currentEstimatedValue)}
                      </td>

                      <td
                        className={
                          property.profitLoss >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {formatCurrency(property.profitLoss)}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AssetCard>
        )}

        {/* Cash */}
        {activeTab === "cash" && (
          <AssetCard
            title="Cash & Bank Balances"
            current={portfolio.cash.totalValue}
          >
            <div className="cash-grid">
              {portfolio.cash.accounts.map((account) => (
                <div
                  className="cash-card"
                  key={account.institution}
                >
                  <span>{account.type}</span>

                  <strong>{account.institution}</strong>

                  <h3>
                    {formatCurrency(account.balance)}
                  </h3>
                </div>
              ))}
            </div>
          </AssetCard>
        )}

      </div>
    </div>
  );
}


/* ----------------------------- */
/* Reusable Components */
/* ----------------------------- */

function SummaryCard({
  title,
  value,
  percentage,
  subtitle,
  positive,
}) {
  return (
    <div className="summary-card">
      <span>{title}</span>

      <h2>{value}</h2>

      {percentage && (
        <p className={positive ? "positive" : "negative"}>
          {positive ? "+" : ""}
          {percentage}
        </p>
      )}

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}


function AssetCard({
  title,
  invested,
  current,
  profitLoss,
  children,
}) {
  return (
    <div className="card asset-card">

      <div className="asset-card-header">
        <div>
          <h2>{title}</h2>

          {invested !== undefined && (
            <p>
              Invested: {formatCurrency(invested)}
            </p>
          )}
        </div>

        <div className="asset-summary">

          {current !== undefined && (
            <strong>
              {formatCurrency(current)}
            </strong>
          )}

          {profitLoss !== undefined && (
            <span
              className={
                profitLoss >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {profitLoss >= 0 ? "+" : ""}
              {formatCurrency(profitLoss)}
            </span>
          )}

        </div>
      </div>

      {children}

    </div>
  );
}