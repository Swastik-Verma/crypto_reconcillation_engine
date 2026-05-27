const { DECMIMAL_PRECISION } = require("../config/constants");

const normalizeDecimal = (value) => {
    if(
        value == null || 
        value == undefined ||
        value === ""
    ){
        return null;
    }

    const numericValue = Number(value);

    if(isNaN(numericValue)) {
        return null;
    }

    return numericValue.toFixed(DECMIMAL_PRECISION);
};

module.exports = normalizeDecimal;