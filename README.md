# Lift-vs.-Stair-Detector
This project implements a smart system to distinguish between elevator and stair usage using the **Lolin32 Lite (ESP32)**, a **BME280 pressure sensor**, and an **accelerometer MPU6050**. The system uses real-time sensor data to determine user behavior based on altitude changes and motion patterns, logging the data for visualization via a **React Native** mobile app built with **Expo Go**.

## Features  
- **Real-Time Data Collection**: Reads altitude and pressure changes from the BME280 and acceleration data from the MPU6050.  
- **Data Logging**: Sends sensor data directly from the ESP32 to a mobile app.  
- **Mobile App**: Built with **React Native** and **Expo Go** for displaying sensor data and visualizations.  
- **IoT Integration**: Demonstrates seamless communication between hardware and mobile frontend.  

## Components Used  
- **Lolin32 Lite (ESP32)**: Microcontroller for Wi-Fi and data processing.  
- **BME280**: Sensor for pressure and altitude measurement.  
- **Accelerometer (MPU6050)**: Captures acceleration and motion data.  
- **React Native**: Mobile app framework for building cross-platform mobile applications.  
- **Expo Go**: Platform for quickly running and testing React Native apps.  

## System Architecture  
1. **ESP32** collects sensor data and sends it directly to the mobile app via Wi-Fi.  
2. **Mobile App** built with React Native fetches and displays the data in real time.  

## Getting Started  

### Hardware Setup  
- Connect the **BME280** and **MPU6050** to the ESP32 as per the pinout in the documentation.  
- Power the ESP32 using USB or a battery.  

### Software Setup  
1. Clone this repository:  
   ```bash
   git clone https://github.com/Aroosa-Batool/Lift-vs.-Stair-Detector.git
   cd LiftStairApp
2. Install dependencies:
    ```bash
    npm install
3. Replace app/(tabs)/SensorScreen line # 5  with ESP32's latest IP
    
4. Start the expo go:
    ```bash
    npx expo start
5. Program the ESP32 using the provided Arduino code(change the WiFi credentials) in the BoardCode directory.


## Contributing  
Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.  

## Acknowledgments  
Special thanks to University of Siegen for proving the opportunity and the open-source community for providing tools and libraries that made this project possible.  

## Demo
https://youtube.com/shorts/90169Pzirlc?si=n-yCoq1Y-A4-W11n