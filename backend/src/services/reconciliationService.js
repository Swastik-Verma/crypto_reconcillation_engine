const { v4: uuidv4 } = require("uuid");

const Transaction = require("../models/Transaction");

const ReconciliationRun = require(
  "../models/ReconciliationRun"
);

const ReconciliationResult = require(
  "../models/ReconciliationResult"
);

const groupTransactions = require(
  "../utils/groupTransactions"
);

const calculateTimestampDifference = require(
  "../utils/calculateTimestampDifference"
);

const calculateQuantityDifference = require(
  "../utils/calculateQuantityDifference"
);

const classifyMatch = require(
  "../utils/classifyMatch"
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

    //
    const userTransactions = await Transaction.find({
        source: "USER",

        validationStatus: {
        $in: ["VALID", "PARTIAL"],
        },
    });

    const exchangeTransactions = await Transaction.find({
        source: "EXCHANGE",

        validationStatus: {
        $in: ["VALID", "PARTIAL"],
        },
    });

    const userGroups = groupTransactions(userTransactions);

    const exchangeGroups = groupTransactions(exchangeTransactions);


    let matchedCount = 0;

    let conflictingCount = 0;

    let unmatchedUserCount = 0;

    let unmatchedExchangeCount = 0;

    const reconciliationResults = [];

    const usedExchangeIds = new Set();
    //

    for (const groupKey in userGroups) {

      const userGroup = userGroups[groupKey];

      const exchangeGroup = exchangeGroups[groupKey] || [];

      for (const userTx of userGroup) {

        let bestCandidate = null;

        let bestTimestampDifference = Number.MAX_VALUE;

        let bestQuantityDifference = Number.MAX_VALUE;

        for (const exchangeTx of exchangeGroup) {
            if (
                usedExchangeIds.has(
                    exchangeTx._id.toString()
                )
            ) {
                continue;
            }

            const userQuantity = Number(
               userTx.normalized.quantity?.toString()
            );

            const exchangeQuantity = Number(
               exchangeTx.normalized.quantity?.toString()
            );

            const timestampDifference = calculateTimestampDifference(
                userTx.normalized.timestamp,
                exchangeTx.normalized.timestamp
            );

            const quantityDifference = calculateQuantityDifference(
                userQuantity,
                exchangeQuantity
            );

            if ( timestampDifference < bestTimestampDifference) {
                bestCandidate = exchangeTx;

                bestTimestampDifference =
                timestampDifference;

                bestQuantityDifference =
                quantityDifference;
            }
        }

        if (!bestCandidate) { 
            reconciliationResults.push({
                reconciliationRunId,

                status: "UNMATCHED_USER",

                userTransactionId:
                userTx._id,

                userTransaction: userTx,

                reasons: [
                "No matching exchange transaction found"
                ],
            });

            unmatchedUserCount++;

            continue;
        }

        const status = classifyMatch({
                timestampDifferenceSeconds:
                bestTimestampDifference,

                quantityDifferencePct:
                bestQuantityDifference,

                timestampToleranceSeconds,

                quantityTolerancePct,
        });

        reconciliationResults.push({
            reconciliationRunId,

            status,

            userTransactionId:
                userTx._id,

            exchangeTransactionId:
                bestCandidate._id,

            userTransaction: userTx,

            exchangeTransaction:
                bestCandidate,

            reasons:
                status === "MATCHED"
                ? ["Matched within tolerance"]
                : ["Exceeded tolerance"],

            differences: {
                timestampDifferenceSeconds:
                bestTimestampDifference,

                quantityDifferencePct:
                bestQuantityDifference,
            },
        });

        usedExchangeIds.add(
            bestCandidate._id.toString()
        );

        if (status === "MATCHED") {
            matchedCount++;
        } else {
            conflictingCount++;
        }
          
      }
    }

    for (const exchangeTx of exchangeTransactions) {
        if (
            usedExchangeIds.has(
                exchangeTx._id.toString()
            )
        ) {
            continue;
        }

        reconciliationResults.push({
            reconciliationRunId,

            status: "UNMATCHED_EXCHANGE",

            exchangeTransactionId:
            exchangeTx._id,

            exchangeTransaction:
            exchangeTx,

            reasons: [
            "No matching user transaction found",
            ],
        });

        unmatchedExchangeCount++;
    }

    await ReconciliationResult.insertMany(
        reconciliationResults
    );

    await ReconciliationRun.findOneAndUpdate(
        {
            reconciliationRunId,
        },
        {
            matchedCount,

            conflictingCount,

            unmatchedUserCount,

            unmatchedExchangeCount,

            totalCompared:
            userTransactions.length,

            completedAt:
            new Date(),
        }
    );

    return {
        reconciliationRunId,

         displayName,

        summary: {
            matchedCount,

            conflictingCount,

            unmatchedUserCount,

            unmatchedExchangeCount,
        },
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