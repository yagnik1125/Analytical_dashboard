const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));

let databaseConnection;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!databaseConnection) {
    databaseConnection = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      databaseConnection = undefined;
      throw error;
    });
  }

  await databaseConnection;
};

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    res.status(503).json({ error: "Database unavailable" });
  }
});

// routes
const recordRoutes = require("./routes/recordRoutes");
app.use(["/api/records", "/records"], recordRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
