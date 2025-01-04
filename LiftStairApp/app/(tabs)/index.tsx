import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
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

        // Update state with received movement and tool values
        if (newData.movement && newData.tool) {
          setMovement(newData.movement);
          setTool(newData.tool);

          // Navigation logic based on received movement and tool
          if (newData.tool === "Lift" && newData.movement === "Up") {
            navigation.navigate("LiftUp");
          } else if (newData.tool === "Lift" && newData.movement === "Down") {
            navigation.navigate("LiftDown");
          } else if (newData.tool === "Stairs" && newData.movement === "Up") {
            navigation.navigate("GoingUp");
          }
          else if (newData.tool === "Stairs" && newData.movement === "Down") {
            navigation.navigate("GoingDown");
          }
          else {
              navigation.navigate("index");
            }
        }

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
  }, [navigation]);

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
          <ThemedText type="subtitle">Detected Tool:</ThemedText>
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
