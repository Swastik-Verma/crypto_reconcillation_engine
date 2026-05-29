const groupTransactions = (transactions) => {
  const groups = {};

  for (const transaction of transactions) {
    const key =
      `${transaction.normalized.canonicalAsset}_` +
      `${transaction.normalized.canonicalType}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(transaction);
  }

  return groups;
};

module.exports = groupTransactions;