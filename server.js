// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const brandRoutes = require("./routes/brandRoute");
const modelRoutes = require("./routes/modelRoute");
const versionRoutes = require("./routes/versionRoute");
const quizRoutes = require("./routes/quizRoute");
const questionRoutes = require("./routes/questionRoute");
const featureRoutes = require("./routes/featureRoute");
const roleRoutes = require("./routes/roleRoute");
const permissionRoutes = require("./routes/permissionRoute");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const seedDatabase = require('./seed'); // <-- 1. IMPORT THE SEEDER

const wss = new WebSocket.Server({ noServer: true });

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/model", modelRoutes);
app.use("/api/version", versionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/feature", featureRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => { // <-- 2. MAKE THE CALLBACK ASYNC
    console.log("connected to database");

    // <-- 3. CALL AND AWAIT THE SEEDING FUNCTION
    await seedDatabase();

    // Create an HTTP server
    const server = app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });

    // Attach the WebSocket server to the HTTP server
    server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });

    wss.on("connection", (ws, req) => {
      // Handle WebSocket messages here
      ws.on("message", (message) => {
        // Parse the message string as JSON
        const jsonMessage = JSON.parse(message);
        jsonMessage.url = req.url.split("?")[0];
        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonMessage));
          }
        });
      });
    });
    wss.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  })
  .catch((err) => {
    console.log(err);
  });