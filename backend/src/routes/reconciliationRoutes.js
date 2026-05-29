const express = require("express");

const router = express.Router();

const {
  reconcileTransactions,
  getReconciliationSummary,
  getUnmatchedTransactions,
} = require("../controllers/reconciliationController");

router.post("/reconcile", reconcileTransactions);

router.get(
  "/report/:runId/summary",
  getReconciliationSummary
);

router.get(
  "/report/:runId/unmatched",
  getUnmatchedTransactions
);

module.exports = router;