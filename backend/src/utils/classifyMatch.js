const classifyMatch = ({
  timestampDifferenceSeconds,
  quantityDifferencePct,

  timestampToleranceSeconds,
  quantityTolerancePct,
}) => {
  const timestampMatch =
    timestampDifferenceSeconds <=
    timestampToleranceSeconds;

  const quantityMatch =
    quantityDifferencePct <=
    quantityTolerancePct;

  if (
    timestampMatch &&
    quantityMatch
  ) {
    return "MATCHED";
  }

  return "CONFLICTING";
};

module.exports = classifyMatch;