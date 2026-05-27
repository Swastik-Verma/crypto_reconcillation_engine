const assetMapping = {
  BTC: "BTC",
  Bitcoin: "BTC",
  bitcoin: "BTC",

  ETH: "ETH",
  Ethereum: "ETH",

  MATIC: "MATIC",

  LINK: "LINK",
};

const normalizeAsset = (asset) => {
    if (!asset) {
        return null;
    }

    return assetMapping[asset] || asset.toUpperCase();
};

module.exports = normalizeAsset;