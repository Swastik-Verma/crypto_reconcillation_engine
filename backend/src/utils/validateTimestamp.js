const validateTimestamp = (timestamp) => {
  if (!timestamp) {
    return {
      valid: false,
      partial: false,
      normalizedTimestamp: null,
      issue: "Missing timestamp",
    };
  }

  const hasTime = timestamp.includes("T");

  if (!hasTime) {
    return {
      valid: true,
      partial: true,
      normalizedTimestamp: new Date(`${timestamp}T00:00:00Z`),
      issue: "Incomplete timestamp",
    };
  }

  const parsedDate = new Date(timestamp);

  if (isNaN(parsedDate.getTime())) {
    return {
      valid: false,
      partial: false,
      normalizedTimestamp: null,
      issue: "Invalid timestamp format",
    };
  }

  return {
    valid: true,
    partial: false,
    normalizedTimestamp: parsedDate,
    issue: null,
  };
};

module.exports = validateTimestamp;