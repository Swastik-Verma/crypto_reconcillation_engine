const typeMapping = {
  BUY: "BUY",
  SELL: "SELL",

  TRANSFER_IN: "TRANSFER",
  TRANSFER_OUT: "TRANSFER",
};

const normalizeTransactionType = (type) => {
  if (!type) {
    return null;
  }

  return typeMapping[type] || type.toUpperCase();
};

module.exports = normalizeTransactionType;