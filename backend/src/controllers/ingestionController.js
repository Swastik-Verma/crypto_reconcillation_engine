const {
  processCSV,
} = require("../services/ingestionService");

const ingestTransactions = async (req, res) => {
  try {

    const userFilePath =
      req.files.userFile[0].path;

    const exchangeFilePath =
      req.files.exchangeFile[0].path;

    const userTransactions =
      await processCSV(
        userFilePath,
        "USER"
      );

    const exchangeTransactions =
      await processCSV(
        exchangeFilePath,
        "EXCHANGE"
      );

    res.json({
      message: "CSV files parsed successfully",

      userTransactionsCount:
        userTransactions.length,

      exchangeTransactionsCount:
        exchangeTransactions.length,

      userTransactions,

      exchangeTransactions,
    });

  } catch (error) {

    res.status(500).json({
      message: "Ingestion failed",

      error: error.message,
    });

  }
};

module.exports = {
  ingestTransactions,
};