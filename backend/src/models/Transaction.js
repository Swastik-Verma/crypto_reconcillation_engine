const mongoose = require("mongoose");

const qualityFlagSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },

    issue: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const matchingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["MATCHED", "CONFLICTING", "UNMATCHED"],
      default: "UNMATCHED",
    },

    matchedMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    matchedSourceTransactionId: {
      type: String,
      default: null,
    },

    matchReason: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["USER", "EXCHANGE"],
      required: true,
    },

    sourceTransactionId: {
      type: String,
      required: true,
    },

    runId: {
      type: String,
      required: true,
    },

    rawRow: {
      type: Object,
      required: true,
    },

    normalized: {
      timestamp: {
        type: Date,
        default: null,
      },

      dateOnly: {
        type: String,
        default: null,
      },

      isPartialTimestamp: {
        type: Boolean,
        default: false,
      },

      transactionType: {
        type: String,
        default: null,
      },

      canonicalType: {
        type: String,
        default: null,
      },

      asset: {
        type: String,
        default: null,
      },

      canonicalAsset: {
        type: String,
        default: null,
      },

      quantity: {
        type: mongoose.Schema.Types.Decimal128,
        default: null,
      },

      price: {
        type: mongoose.Schema.Types.Decimal128,
        default: null,
      },

      fee: {
        type: mongoose.Schema.Types.Decimal128,
        default: null,
      },
    },

    validationStatus: {
      type: String,
      enum: ["VALID", "PARTIAL", "INVALID"],
      default: "VALID",
    },

    qualityFlags: {
      type: [qualityFlagSchema],
      default: [],
    },

    matching: {
      type: matchingSchema,
      default: () => ({
        status: "UNMATCHED",
      }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);