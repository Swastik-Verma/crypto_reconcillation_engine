const fs = require("fs");
const csv = require("csv-parser");

const Transaction = require("../models/Transaction");

const normalizeAsset = require("../utils/normalizeAsset");

const normalizeTransactionType = require("../utils/normalizeTransactionType");

const normalizeDecimal = require("../utils/normalizeDecimal");

const validateTimestamp = require("../utils/validateTimestamp");

const processCSV = async (filePath,source) => {
  return new Promise((resolve, reject) => {

    const rows = [];

    fs.createReadStream(filePath)

      .pipe(csv())

      .on("data", (row) => {

        const timestamp =
          row.timestamp || row.Timestamp;

        const type =
          row.type || row.Type;

        const asset =
          row.asset || row.Asset;

        const quantity =
          row.quantity || row.Quantity;

        const price =
          row.price ||
          row.Price ||
          row.price_usd ||
          row.Price_USD;

        const fee =
          row.fee || row.Fee;

        const transactionId =
          row.id ||
          row.ID ||
          row.transaction_id ||
          row.Transaction_ID ||
          `generated_${Date.now()}_${Math.random()}`;

        const qualityFlags = [];

        const timestampValidation =
          validateTimestamp(timestamp);

        if (timestampValidation.issue) {
          qualityFlags.push({
            field: "timestamp",
            issue: timestampValidation.issue,
          });
        }

        let validationStatus = "VALID";

        if (timestampValidation.partial) {
          validationStatus = "PARTIAL";
        }

        if (!timestampValidation.valid) {
          validationStatus = "INVALID";
        }

        const normalizedTransaction = {
          source: source,

          sourceTransactionId: transactionId,

          runId: "temporary_run_id",

          rawRow: row,

          normalized: {

            timestamp:
              timestampValidation.normalizedTimestamp,

            dateOnly: timestamp
              ? timestamp.split("T")[0]
              : null,

            isPartialTimestamp:
              timestampValidation.partial,

            transactionType: type,

            canonicalType:
              normalizeTransactionType(type),

            asset: asset,

            canonicalAsset:
              normalizeAsset(asset),

            quantity:
              normalizeDecimal(quantity),

            price:
              normalizeDecimal(price),

            fee:
              normalizeDecimal(fee),
          },

          validationStatus,

          qualityFlags,
        };

        rows.push(normalizedTransaction);
      })

      .on("end", () => {

        console.log("CSV Parsing Completed");

        resolve(rows);
      })

      .on("error", (error) => {

        reject(error);
      });
  });
};

module.exports = {
  processCSV,
};