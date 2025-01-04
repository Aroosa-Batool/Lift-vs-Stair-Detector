#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include "SparkFunBME280.h"

// Wi-Fi credentials
const char* ssid = "TP-LINK_09C8";
const char* password = "66328643";

// Server URL
const char* serverUrl = "http://192.168.0.101:3000/api/data";

// Sensor objects
BME280 mySensorB;
Adafruit_MPU6050 mpu;
TwoWire I2C_MPU = TwoWire(1); // For MPU6050

// Rolling buffer for last 5 values
#define BUFFER_SIZE 5
float pressureBuffer[BUFFER_SIZE] = {0};
float accXBuffer[BUFFER_SIZE] = {0};
float accYBuffer[BUFFER_SIZE] = {0};
float accZBuffer[BUFFER_SIZE] = {0};
int bufferIndex = 0;
bool bufferFilled = false;  // To ensure calculations start after at least 5 values

void setup() {
  Serial.begin(115200);

  // Initialize Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");

  // Initialize BME280
  Wire.begin(19, 22);
  mySensorB.setI2CAddress(0x76);
  if (!mySensorB.beginI2C()) {
    Serial.println("Failed to connect to BME280");
    while (1);
  }

  // Power pins for MPU6050 (optional)
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  digitalWrite(12, LOW);  // GND
  digitalWrite(13, HIGH); // VCC

  // Initialize MPU6050
  I2C_MPU.begin(16, 17);
  if (!mpu.begin(0x68, &I2C_MPU)) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Retrieve data from MPU6050
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    // Retrieve data from BME280
    float pressure = mySensorB.readFloatPressure();          // Pressure in Pa
    float altitude = mySensorB.readFloatAltitudeMeters();    // Altitude in meters
    float temperature = (mySensorB.readTempF() - 32) * 5.0 / 9.0; // Temperature in Celsius

    // Update the rolling buffer
    pressureBuffer[bufferIndex] = pressure;
    accXBuffer[bufferIndex] = a.acceleration.x;
    accYBuffer[bufferIndex] = a.acceleration.y;
    accZBuffer[bufferIndex] = a.acceleration.z;

    bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;
    if (bufferIndex == 0) bufferFilled = true; // Buffer is filled after first 5 readings

    String movement = "Not Moving";
    String tool = "Stationary";

    // Process data only if buffer has at least 5 values
    if (bufferFilled) {
      float meanPressure = calculateMean(pressureBuffer);
      float varPressure = calculateVariance(pressureBuffer, meanPressure);

      float meanAccX = calculateMean(accXBuffer);
      float varAccX = calculateVariance(accXBuffer, meanAccX);
      
      float meanAccY = calculateMean(accYBuffer);
      float varAccY = calculateVariance(accYBuffer, meanAccY);
      
      float meanAccZ = calculateMean(accZBuffer);
      float varAccZ = calculateVariance(accZBuffer, meanAccZ);

      // Movement & Tool Detection Algorithm
      if (varPressure > 0.3 && meanPressure < 1010) tool = "Lift";
      if (varAccX > 0.5 || varAccY > 0.3 || varAccZ > 0.5) tool = "Stairs";

      if (meanAccZ > 0.5) movement = "Up";
      else if (meanAccZ < -0.5) movement = "Down";

      // Send data to the server
      sendDataToServer(pressure, altitude, temperature, a.acceleration.x, a.acceleration.y, a.acceleration.z, tool, movement);

      // Print sensor data to Serial Monitor
      Serial.printf("Acceleration X: %.2f, Y: %.2f, Z: %.2f m/s^2\n", a.acceleration.x, a.acceleration.y, a.acceleration.z);
      Serial.printf("Pressure: %.2f Pa, Altitude: %.2f m, Temp: %.2f degC\n", pressure, altitude, temperature);
      Serial.printf("Movement: %s, Tool: %s\n", movement.c_str(), tool.c_str());
    }
  } else {
    Serial.println("Wi-Fi not connected");
  }

  delay(200); // Adjust as needed
}

// Function to calculate mean
float calculateMean(float arr[]) {
  float sum = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    sum += arr[i];
  }
  return sum / BUFFER_SIZE;
}

// Function to calculate variance
float calculateVariance(float arr[], float mean) {
  float sum = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) {
    sum += pow(arr[i] - mean, 2);
  }
  return sum / BUFFER_SIZE;
}

// Function to send data to the server
void sendDataToServer(float pressure, float altitude, float temperature, float accX, float accY, float accZ, String tool, String movement) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"pressure\":" + String(pressure, 2) + ",";
  payload += "\"altitude\":" + String(altitude, 2) + ",";
  payload += "\"temperature\":" + String(temperature, 2) + ",";
  payload += "\"acceleration_x\":" + String(accX, 2) + ",";
  payload += "\"acceleration_y\":" + String(accY, 2) + ",";
  payload += "\"acceleration_z\":" + String(accZ, 2) + ",";
  payload += "\"movement\":\"" + movement + "\",";
  payload += "\"tool\":\"" + tool + "\"";
  payload += "}";

  int httpResponseCode = http.POST(payload);
  if (httpResponseCode > 0) {
    Serial.println("Data sent successfully");
    Serial.println(http.getString());
  } else {
    Serial.print("Error sending data: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}
