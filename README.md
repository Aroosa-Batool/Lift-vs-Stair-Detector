# Lift-vs.-Stair-Detector
This project implements a smart system to distinguish between elevator and stair usage using the **Lolin32 Lite (ESP32)**, a **BME280 pressure sensor**, and an **accelerometer MPU6050**. The system uses real-time sensor data to determine user behavior based on altitude changes and motion patterns, logging the data for visualization via a web interface.  

## Features  
- **Real-Time Data Collection**: Reads altitude and pressure changes from the BME280 and acceleration data from the MPU6050.  
- **Data Logging**: Sends sensor data to a server using HTTP requests.  
- **Backend Server**: Built with Node.js and MongoDB to handle data storage and provide APIs.  
- **Interactive Dashboard**: A React-based web app to fetch, display, and visualize sensor data.  
- **IoT Integration**: Demonstrates seamless communication between hardware, server, and frontend.  

## Components Used  
- **Lolin32 Lite (ESP32)**: Microcontroller for Wi-Fi and data processing.  
- **BME280**: Sensor for pressure and altitude measurement.  
- **Accelerometer (MPU6050)**: Captures acceleration and motion data.  
- **Node.js**: Backend server for data storage and APIs.  
- **MongoDB**: Database to store sensor readings.  
- **React**: Frontend for visualizing data.  

## System Architecture  
1. **ESP32** collects sensor data and sends it to the backend server over Wi-Fi.  
2. **Backend Server** receives and stores data in MongoDB.  
3. **React Web App** fetches and displays the data from the server via REST APIs.  


## Getting Started  

### Hardware Setup  
- Connect the **BME280** and **MPU6050** to the ESP32 as per the pinout in the documentation.  
- Power the ESP32 using USB or a battery.  

### Software Setup  
1. Clone this repository:  
   ```bash
   git clone https://github.com/your-username/lift-vs-stair-detector.git
   cd lift-vs-stair-detector
2. Install dependencies for the backend:
    ```bash
    cd backend
    npm install
3. Start the backend server:
    ```bash
    node server.js
4. Install dependencies for the frontend:
    ```bash
    cd ../frontend
    npm install
5. Start the React app:
    ```bash
    npm start
6. Program the ESP32 using the provided Arduino code in the esp32-code directory.

### APIs
- POST /api/data: Logs sensor data to the database.
- GET /api/data: Fetches the logged data for visualization.
## Deployment  
- **Backend**: Deploy the backend server on platforms like **Heroku**, **AWS**, or **Railway**.  
- **Frontend**: Host the frontend on platforms like **Netlify**, **Vercel**, or **GitHub Pages**.  
- **ESP32 Configuration**: Ensure the ESP32's Wi-Fi credentials are updated to connect to your network and the server URL matches your deployment.  

## Future Improvements  
- Add live data streaming using **WebSockets** or **MQTT** for real-time updates.  
- Implement advanced analytics with **machine learning** for more accurate lift vs. stair detection.  
- Create a **mobile-friendly user interface** for easier accessibility.  
- Enhance visualizations with charts and graphs using libraries like **Chart.js** or **D3.js**.  

## Contributing  
Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.  

## Acknowledgments  
Special thanks to University of Siegen for proving the opportunity and the open-source community for providing tools and libraries that made this project possible.  