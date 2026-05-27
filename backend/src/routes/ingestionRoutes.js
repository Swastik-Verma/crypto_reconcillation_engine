const express = require("express");

const upload = require("../middlewares/uploadMiddleware");

const {
    ingestTransactions,
} = require("../controllers/ingestionController");

const router = express.Router();

router.post(
  "/ingest",
  upload.single("file"),
  ingestTransactions
);

module.exports = router;