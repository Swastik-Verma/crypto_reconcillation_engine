const { v4: uuidv4 } = require("uuid");

const Transaction = require("../models/Transaction");

const ReconciliationRun = require(
  "../models/ReconciliationRun"
);

const ReconciliationResult = require(
  "../models/ReconciliationResult"
);

const runReconciliation = async (config) => {
  const timestampToleranceSeconds =
    config.timestampToleranceSeconds || 300;

  const quantityTolerancePct =
    config.quantityTolerancePct || 0.01;

  const reconciliationRunId = uuidv4();

  const displayName = `Run_TS${timestampToleranceSeconds}_Q${quantityTolerancePct}`;

  const reconciliationRun =
    await ReconciliationRun.create({
      reconciliationRunId,
      displayName,

      timestampToleranceSeconds,
      quantityTolerancePct,
    });

  return {
    reconciliationRunId,
    displayName,

    timestampToleranceSeconds,
    quantityTolerancePct,

    message:
      "Reconciliation run initialized successfully",
  };
};

const fetchSummary = async (runId) => {
  const reconciliationRun =
    await ReconciliationRun.findOne({
      reconciliationRunId: runId,
    });

  if (!reconciliationRun) {
    throw new Error("Reconciliation run not found");
  }

  return {
    matchedCount:
      reconciliationRun.matchedCount,

    conflictingCount:
      reconciliationRun.conflictingCount,

    unmatchedUserCount:
      reconciliationRun.unmatchedUserCount,

    unmatchedExchangeCount:
      reconciliationRun.unmatchedExchangeCount,
  };
};

const fetchUnmatchedTransactions =
  async (runId) => {
    const unmatchedTransactions =
      await ReconciliationResult.find({
        reconciliationRunId: runId,

        status: {
          $in: [
            "UNMATCHED_USER",
            "UNMATCHED_EXCHANGE",
          ],
        },
      });

    return unmatchedTransactions;
  };

module.exports = {
  runReconciliation,
  fetchSummary,
  fetchUnmatchedTransactions,
};