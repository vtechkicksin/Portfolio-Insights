import "./App.css";
import PortfolioDashboard from "./components/Dashboard/PortfolioDashboard";
import data from "./service/data.json";

function App() {
  return (
    <PortfolioDashboard portfolioData={data} />
  );
}

export default App;