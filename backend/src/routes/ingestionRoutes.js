const express = require("express");

const upload = require("../middlewares/uploadMiddleware");

const {
    ingestTransactions,
} = require("../controllers/ingestionController");

const router = express.Router();

router.post(
  "/ingest",
  upload.fields([
    { name: "userFile", maxCount: 1 },
    { name: "exchangeFile", maxCount: 1 },
  ]),
  ingestTransactions
);

module.exports = router;