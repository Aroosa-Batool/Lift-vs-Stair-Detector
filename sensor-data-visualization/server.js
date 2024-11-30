const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/sensorData", {
});

const DataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  pressure: Number,
  altitude: Number,
  acceleration_x: Number,
  acceleration_y: Number,
  acceleration_z: Number,
});

const Data = mongoose.model("Data", DataSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API to log data
app.post("/api/data", async (req, res) => {
  try {
    const data = new Data(req.body);
    await data.save();
    res.status(201).send({ message: "Data logged successfully." });
  } catch (err) {
    res.status(400).send({ error: "Failed to log data." });
  }
});

// API to fetch data
app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find().sort({ timestamp: -1 });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ error: "Failed to fetch data." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
