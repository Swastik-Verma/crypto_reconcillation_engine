const mongoose = require("mongoose");

const reconciliationResultSchema = new mongoose.Schema(
  {
    reconciliationRunId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "MATCHED",
        "CONFLICTING",
        "UNMATCHED_USER",
        "UNMATCHED_EXCHANGE",
      ],
      required: true,
    },

    userTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },

    exchangeTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },

    userTransaction: {
      type: Object,
      default: null,
    },

    exchangeTransaction: {
      type: Object,
      default: null,
    },

    reasons: [
      {
        type: String,
      },
    ],

    differences: {
      timestampDifferenceSeconds: {
        type: Number,
        default: null,
      },

      quantityDifferencePct: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReconciliationResult",
  reconciliationResultSchema
);