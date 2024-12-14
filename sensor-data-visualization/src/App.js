import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import GoingDown from './GoingDown';
import GoingUp from './GoingUp';
import LiftDown from './LiftDown';
import LiftUp from './LiftUp';

function App() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch historical data from the REST API
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/data");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // WebSocket connection for real-time data
    const ws = new WebSocket("ws://localhost:8080"); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        // Update the state with new data
        setData((prevData) => [newData, ...prevData]);

        // Navigation logic based on new data
        if (newData.acceleration_z < -0.5) {
          //navigate("/going-down");
        } else if (newData.acceleration_z > 0.5) {
         // navigate("/going-up");
        }
        // Add other conditions for lift-up or lift-down here as needed
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [navigate]);

  return (
    <div className="data">
      <h1>Sensor Data</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Pressure (hPa)</th>
            <th>Altitude (m)</th>
            <th>Accel X</th>
            <th>Accel Y</th>
            <th>Accel Z</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.pressure}</td>
              <td>{item.altitude}</td>
              <td>{item.acceleration_x}</td>
              <td>{item.acceleration_y}</td>
              <td>{item.acceleration_z}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/going-down" element={<GoingDown />} />
        <Route path="/going-up" element={<GoingUp />} />
        <Route path="/lift-up" element={<LiftUp />} />
        <Route path="/lift-down" element={<LiftDown />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
