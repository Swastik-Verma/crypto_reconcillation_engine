const mongoose = require("mongoose");

const ingestionRunSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      unique: true,
    },

    source: {
      type: String,
      enum: ["USER", "EXCHANGE"],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    totalRows: {
      type: Number,
      default: 0,
    },

    validRows: {
      type: Number,
      default: 0,
    },

    partialRows: {
      type: Number,
      default: 0,
    },

    invalidRows: {
      type: Number,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "IngestionRun",
  ingestionRunSchema
);