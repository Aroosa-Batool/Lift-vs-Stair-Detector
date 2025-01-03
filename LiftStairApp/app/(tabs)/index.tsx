import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [buffer, setBuffer] = useState<any[]>([]);
  const [movement, setMovement] = useState<string>("Detecting...");
  const [tool, setTool] = useState<string>("Detecting...");

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch historical data
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.0.101/api/data");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // WebSocket connection
    const ws = new WebSocket("ws://192.168.0.101:8080");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        // Update the buffer with new data (keep only the last 5 values)
        setBuffer((prevBuffer) => {
          const updatedBuffer = [...prevBuffer, newData].slice(-5);
          if (updatedBuffer.length === 5) processData(updatedBuffer);
          return updatedBuffer;
        });

        // Update the state with new data
        setData((prevData) => [newData, ...prevData]);

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
  }, []);

  // Function to calculate mean
  const calculateMean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

  // Function to calculate variance
  const calculateVariance = (values: number[], mean: number) =>
    values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;

  // Process the last 5 values
  // Process the last 5 values
const processData = (batch: any[]) => {
  // Extract pressure and acceleration values for each axis
  const pressures = batch.map(item => item.pressure);
  const accelerationX = batch.map(item => item.acceleration_x);
  const accelerationY = batch.map(item => item.acceleration_y);
  const accelerationZ = batch.map(item => item.acceleration_z);

  // Calculate mean and variance for pressure
  const meanPressure = calculateMean(pressures);
  const varPressure = calculateVariance(pressures, meanPressure);

  // Calculate variance for each acceleration axis separately
  const varAccelerationX = calculateVariance(accelerationX, calculateMean(accelerationX));
  const varAccelerationY = calculateVariance(accelerationY, calculateMean(accelerationY));
  const varAccelerationZ = calculateVariance(accelerationZ, calculateMean(accelerationZ));

  // Movement detection logic based on variance of individual axes
  let detectedMovement = "Stationary";
  let detectedTool = "Void";

  
  if (varPressure > 0.3 && meanPressure < 1010) detectedTool = "Lift";

  // If the variance of any acceleration axis exceeds a threshold, it indicates movement on stairs
  if (varAccelerationX > 0.5 || varAccelerationY > 0.3 || varAccelerationZ > 0.5) {
    detectedTool = "Stairs";
  }

  // Set the detected movement in state
  setMovement(detectedMovement);
  setTool(detectedTool);
};


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to the Lift Detector</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sensor Data</ThemedText>

        {/* Display the detected movement on the screen */}
        <ThemedView style={styles.movementContainer}>
          <ThemedText type="subtitle">Detected Movement:</ThemedText>
          <ThemedText style={styles.movementText}>{movement}</ThemedText>
          <ThemedText type="subtitle">Detected tool:</ThemedText>
          <ThemedText style={styles.movementText}>{tool}</ThemedText>
        </ThemedView>

        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ThemedText>TimeStamp {new Date(item.timestamp).toLocaleString()}</ThemedText>
              <ThemedText>Temp {item.temperature} °C</ThemedText>
              <ThemedText>Pressure {item.pressure} hPa</ThemedText>
              <ThemedText>Altitude {item.altitude} m</ThemedText>
              <ThemedText>Acceleration X: {item.acceleration_x}</ThemedText>
              <ThemedText>Acceleration Y: {item.acceleration_y}</ThemedText>
              <ThemedText>Acceleration Z: {item.acceleration_z}</ThemedText>
            </View>
          )}
          nestedScrollEnabled
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  movementContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  movementText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  row: {
    marginBottom: 12,
  },
});

