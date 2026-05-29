const mongoose = require("mongoose");

const reconciliationRunSchema = new mongoose.Schema(
  {
    reconciliationRunId: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    timestampToleranceSeconds: {
      type: Number,
      required: true,
      default: 300,
    },

    quantityTolerancePct: {
      type: Number,
      required: true,
      default: 0.01,
    },

    totalCompared: {
      type: Number,
      default: 0,
    },

    matchedCount: {
      type: Number,
      default: 0,
    },

    conflictingCount: {
      type: Number,
      default: 0,
    },

    unmatchedUserCount: {
      type: Number,
      default: 0,
    },

    unmatchedExchangeCount: {
      type: Number,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReconciliationRun",
  reconciliationRunSchema
);