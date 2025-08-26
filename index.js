require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const brandRoutes = require("./routes/brandRoute");
const modelRoutes = require("./routes/modelRoute");
const quizRoutes = require("./routes/quizRoute");
const questionRoutes = require("./routes/questionRoute");
const featureRoutes = require("./routes/featureRoute");
const roleRoutes = require("./routes/roleRoute");
const permissionRoutes = require("./routes/permissionRoute");

const app = express();

app.use(cors());


app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/model", modelRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/feature", featureRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);

// A simple root route to confirm the API is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the QuizCars API!" });
});


// --- Database Connection and Server Startup ---
console.log("Attempting to connect to the database...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database successfully.");
    const server = app.listen(process.env.PORT || 3000, () => {
      console.log("Server is listening for requests on port", process.env.PORT || 3000);
    });

    // --- WebSocket Server Setup ---
    // Attach the WebSocket server to the running HTTP server
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {
      console.log("A new client connected via WebSocket.");

      // Handle messages received from a client
      ws.on("message", (message) => {
        console.log(`Received WebSocket message: ${message}`);
        
        // Broadcast the received message to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      });

      ws.on("close", () => {
        console.log("WebSocket client disconnected.");
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });

  })
  .catch((err) => {
    // If the database connection fails, the server will not start.
    console.error("FATAL ERROR: Could not connect to the database. Server has not started.");
    console.error(err);
  });