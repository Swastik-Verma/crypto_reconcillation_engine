const calculateQuantityDifference = (
  quantity1,
  quantity2
) => {
  const difference =
    Math.abs(quantity1 - quantity2);

  const maxValue =
    Math.max(quantity1, quantity2);

  if (maxValue === 0) {
    return 0;
  }

  return (difference / maxValue) * 100;
};

module.exports =
  calculateQuantityDifference;