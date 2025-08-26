// /api/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// --- Import all your route handlers ---
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const brandRoutes = require("./routes/brandRoute");
const modelRoutes = require("./routes/modelRoute");
const quizRoutes = require("./routes/quizRoute");
const questionRoutes = require("./routes/questionRoute");

const app = express();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : [];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Welcome to the QuizCars API!",
    status: "ok",
    documentation: "Please refer to the project documentation for available endpoints."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/model", modelRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/question", questionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to database successfully."))
  .catch((err) => console.error("Database connection error:", err));

module.exports = app;
