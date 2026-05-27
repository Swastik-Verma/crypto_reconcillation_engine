const ingestTransactions = async (req, res) => {
    try {
        res.json({
            message: "File uploaded successfully",
            file: req.file,
        });
    } catch (error) {
        res.status(500).json({
            message: "Ingestion failed",
            error: error.message,
        });
    }
};

module.exports = {
    ingestTransactions,
};