const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws"); // Add WebSocket support

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/sensorData", {});

// Define the data schema to include tool and direction
const DataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  pressure: Number,
  altitude: Number,
  acceleration_x: Number,
  acceleration_y: Number,
  acceleration_z: Number,
  tool: { type: String, default: "Unknown" },  // Ensuring default value
  movement: { type: String, default: "Unknown" },  // Ensuring default value
});
const Data = mongoose.model("Data", DataSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// WebSocket Server Setup
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("close", () => console.log("WebSocket client disconnected"));
});

// POST endpoint for ESP32 to send data
app.post("/api/data", async (req, res) => {
  try {
    const data = new Data(req.body);
    await data.save();

    // Notify WebSocket clients about new data
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(req.body)); // Send new data to WebSocket clients
      }
    });

    res.status(201).send({ message: "Data logged successfully." });
  } catch (err) {
    res.status(400).send({ error: "Failed to log data." });
  }
});

// GET endpoint to fetch historical data
app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find().sort({ timestamp: -1 });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ error: "Failed to fetch data." });
  }
});

// GET endpoint for the latest tool and direction
app.get("/api/state", async (req, res) => {
  try {
    const latestData = await Data.findOne().sort({ timestamp: -1 });
    if (latestData) {
      res.status(200).send({
        tool: latestData.tool,
        movement: latestData.movement,
      });
    } else {
      res.status(404).send({ error: "No data available." });
    }
  } catch (err) {
    res.status(400).send({ error: "Failed to fetch state data." });
  }
});

// Start the Express server
app.listen(3000, () => console.log("REST API Server running on port 3000"));
