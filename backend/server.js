const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");

const reconciliationRoutes = require(
  "./src/routes/reconciliationRoutes"
);

const ingestionRoutes = require("./src/routes/ingestionRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api", ingestionRoutes);

app.use("/api", reconciliationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});