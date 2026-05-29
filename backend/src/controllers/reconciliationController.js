const {
  runReconciliation,
  fetchSummary,
  fetchUnmatchedTransactions,
} = require("../services/reconciliationService");

const reconcileTransactions = async (req, res) => {
  try {
    const result = await runReconciliation(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Reconciliation failed",
      error: error.message,
    });
  }
};

const getReconciliationSummary = async (req, res) => {
  try {
    const { runId } = req.params;

    const summary = await fetchSummary(runId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch summary",
      error: error.message,
    });
  }
};

const getUnmatchedTransactions = async (req, res) => {
  try {
    const { runId } = req.params;

    const unmatched =
      await fetchUnmatchedTransactions(runId);

    res.status(200).json({
      success: true,
      data: unmatched,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch unmatched transactions",
      error: error.message,
    });
  }
};

module.exports = {
  reconcileTransactions,
  getReconciliationSummary,
  getUnmatchedTransactions,
};