import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const ESP32_IP = 'http://192.168.0.101:8081'; // Replace with ESP32's actual IP

const SensorDataScreen = () => {
  const [sensorData, setSensorData] = useState({});
  const navigation = useNavigation(); // Get navigation object

  const fetchSensorData = async () => {
    try {
      const response = await fetch(ESP32_IP);
      const text = await response.text();

      // Parse text response into key-value pairs
      const parsedData = text.split("\n").reduce((acc, line) => {
        const [key, value] = line.split(": ");
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {});

      setSensorData(parsedData);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchSensorData(); // Fetch data on mount
    const interval = setInterval(fetchSensorData, 0.1); // Fetch every 0.1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Extract Movement and Tool from sensor data
  const movement = sensorData["Movement"];
  const tool = sensorData["Tool"];

  useEffect(() => {
    // Navigation logic based on received movement and tool
    if (tool === "Lift"){
      if(movement === "Up"){
        navigation.navigate("LiftUp");

      } else navigation.navigate("LiftDown");

    } else if(tool === "Stairs"){
      if(movement === "Up"){
        navigation.navigate("GoingUp");
      } else  navigation.navigate("GoingDown");

    } else  navigation.navigate("index");

  }, [movement, tool]); // Trigger navigation when movement or tool changes

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>ESP32 Sensor Data</Text>
      {Object.entries(sensorData).map(([key, value]) => (
        <Text key={key} style={styles.dataText}>
          {key}: {value}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataText: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
});

export default SensorDataScreen;
