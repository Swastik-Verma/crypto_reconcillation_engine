const IngestionRun = require(
  "../models/IngestionRun"
);
const { v4: uuidv4} = require("uuid");

const {
  processCSV,
} = require("../services/ingestionService");

const ingestTransactions = async (req, res) => {
  try {

    const userFilePath =
      req.files.userFile[0].path;

    const exchangeFilePath =
      req.files.exchangeFile[0].path;

    
    const runId = uuidv4();

    const ingestionRun =
      await IngestionRun.create({

        runId,

        source: "BOTH",

        fileName:
          "user_and_exchange_upload",

        totalRows: 0,

        validRows: 0,

        partialRows: 0,

        invalidRows: 0,
    });

    const userTransactions =
      await processCSV(
        userFilePath,
        "USER",
        runId
      );

    const exchangeTransactions =
      await processCSV(
        exchangeFilePath,
        "EXCHANGE",
        runId
      );

    const allTransactions = [
      ...userTransactions,
      ...exchangeTransactions,
    ];

    const validRows = allTransactions.filter(
      (transaction) => transaction.validationStatus === "VALID"
    ).length;

    const partialRows = allTransactions.filter(
      (transaction) => transaction.validationStatus === "PARTIAL"
    ).length;

    const invalidRows = allTransactions.filter(
      (transaction) => transaction.validationStatus === "INVALID"
    ).length;

    await IngestionRun.findOneAndUpdate(
      {runId},
      {
        totalRows: allTransactions.length,
        validRows,
        partialRows,
        invalidRows,
        completedAt: new Date(),
      }
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