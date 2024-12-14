// HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch historical data from the REST API
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.0.103/api/data");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // WebSocket connection for real-time data
    const ws = new WebSocket("ws://192.168.0.103:8080"); // Replace with your WebSocket server URL

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
          navigation.navigate("GoingDown");
        } else if (newData.acceleration_z > 0.5) {
      //    navigation.navigate("GoingUp");
        }
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
        
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.row}>
      {/* Text components with white text */}
      <ThemedText>TimeStamp {new Date(item.timestamp).toLocaleString()}</ThemedText>
      <ThemedText>Temp {item.temperature} °C</ThemedText>
      <ThemedText>Pressure {item.pressure} hPa</ThemedText>
      <ThemedText>Altitude {item.altitude} m</ThemedText>
      <ThemedText>Acceleration X: {item.acceleration_x}</ThemedText>
      <ThemedText>Acceleration Y: {item.acceleration_y}</ThemedText>
      <ThemedText>Acceleration Z: {item.acceleration_z}</ThemedText>
         </View>
          )}
          nestedScrollEnabled // Enable scrolling inside the FlatList
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
  textWhite: {
    color: 'white', // Set text color to white
  },
});
