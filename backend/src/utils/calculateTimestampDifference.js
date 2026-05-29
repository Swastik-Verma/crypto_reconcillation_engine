const calculateTimestampDifference = (
  timestamp1,
  timestamp2
) => {
  const time1 = new Date(timestamp1);
  const time2 = new Date(timestamp2);

  const differenceMs =
    Math.abs(time1 - time2);

  return differenceMs / 1000;
};

module.exports = calculateTimestampDifference;