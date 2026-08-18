const portfoliodata = require('../../service/data.json')


class PortfolioDataController {
  static async getPortfolioData(req, res) {
    try {
      const data = portfoliodata;
      return res.status(200).json({
        portfoliodata:data,
        message: "Portfolio data fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch portfolio data",
        error: error.message,
      });
    }
  }
}

module.exports = PortfolioDataController;