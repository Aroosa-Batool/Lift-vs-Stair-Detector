#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include "SparkFunBME280.h"

// Wi-Fi Credentials
const char* ssid = "TP-LINK_09C8";
const char* password = "66328643";

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
float GravityBuffer[BUFFER_SIZE] = {0};
float AltitudeBuffer[BUFFER_SIZE] = {0};
int bufferIndex = 0;
bool bufferFilled = false;

WiFiServer server(8081);

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    server.begin();

    // Initialize BME280
    Wire.begin(19, 22);
    mySensorB.setI2CAddress(0x76);
    if (!mySensorB.beginI2C()) {
        Serial.println("Failed to connect to BME280");
        while (1);
    }

    // Power pins for MPU6050
    pinMode(12, OUTPUT);
    pinMode(13, OUTPUT);
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);

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
    WiFiClient client = server.available();
    if (client) {
        Serial.println("New Client Connected");
        while (client.connected()) {
            if (client.available()) {
                client.readStringUntil('\r');
                client.flush();

                sensors_event_t a, g, temp;
                mpu.getEvent(&a, &g, &temp);

                float pressure = mySensorB.readFloatPressure();
                float altitude = mySensorB.readFloatAltitudeMeters();
                
                
                pressureBuffer[bufferIndex] = pressure;
                accXBuffer[bufferIndex] = a.acceleration.x;
                accYBuffer[bufferIndex] = a.acceleration.y;
                accZBuffer[bufferIndex] = a.acceleration.z;
                GravityBuffer[bufferIndex] = readG();
                AltitudeBuffer[bufferIndex] = altitude;

                bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;
                if (bufferIndex == 0) bufferFilled = true;

                float meanPressure = calculateMean(pressureBuffer);
                float meanAccX = calculateMean(accXBuffer);
                float meanAccY = calculateMean(accYBuffer);
                float meanAccZ = calculateMean(accZBuffer);
                float meanG = calculateMean(GravityBuffer);
                float meanAltitude = calculateMean(AltitudeBuffer);
                
                float Gvariance = calculateVariance(GravityBuffer, meanG);
                float altitudeVariance = calculateVariance(AltitudeBuffer, meanAltitude);
               float PressureVariance = calculateVariance(pressureBuffer, meanPressure );
                
                // ----------------------------LOGIC----------------------------------------------------------------------------------------------
                String movement = "Not Moving";
                String tool = "Stationary";
                if(PressureVariance < 100 && altitudeVariance < 0.6){
                  if(Gvariance  > 0.1){
                  tool = "Stairs";
                } else tool = "stationary";

                } else {
                    if(Gvariance  > 0.01)
                      tool = "Stairs";
                      else tool = "Lift";

                }                
                movement = (calculatePrevPressure(pressureBuffer) < 0) ? "Up" : "Down";

                 String response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n";
                  response += "Movement: " +  movement + " \n";
                  response += "Tool: " + tool + " \n";
                client.print(response);
                client.stop();
                Serial.print(response);
            }
        }
    }
    delay(800);
}
float calculateMean(float arr[]) {
    float sum = 0;
    for (int i = 0; i < BUFFER_SIZE; i++) {
        sum += arr[i];
    }
    return sum / BUFFER_SIZE;
}
float calculateVariance(float arr[], float mean) {
    float sum = 0;
    for (int i = 0; i < BUFFER_SIZE; i++) {
        sum += pow(arr[i] - mean, 2);
    }
    return sum / BUFFER_SIZE;
}
float calculatePrevPressure(float arr[]) {
    float meanP = 0, diffArray[BUFFER_SIZE - 1];
    if (bufferIndex != 0){
        meanP = arr[0] - arr[4];
    } else {meanP = arr[4] - arr[0];}
    return meanP;
}
float readG() {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    float ax = a.acceleration.x / 9.81;
    float ay = a.acceleration.y / 9.81;
    float az = a.acceleration.z / 9.81;
    return sqrt(ax * ax + ay * ay + az * az);
}
