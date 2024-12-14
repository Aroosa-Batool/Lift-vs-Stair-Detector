import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch historical data from the REST API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/data'); // Replace with your API URL
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // WebSocket connection for real-time data
    const ws = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket URL

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        // Update the state with new data
        setData((prevData) => [newData, ...prevData]);

        // Navigation logic based on new data
        if (newData.acceleration_z < -0.5) {
          navigation.navigate('GoingDown');
        } else if (newData.acceleration_z > 0.5) {
          navigation.navigate('GoingUp');
        }
        // Add other conditions for lift-up or lift-down here as needed
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text style={styles.cell}>{item.pressure}</Text>
            <Text style={styles.cell}>{item.altitude}</Text>
            <Text style={styles.cell}>{item.acceleration_x}</Text>
            <Text style={styles.cell}>{item.acceleration_y}</Text>
            <Text style={styles.cell}>{item.acceleration_z}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default App;
