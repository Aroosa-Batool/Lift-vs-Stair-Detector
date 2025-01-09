import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BluetoothScreen = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const bleManager = new BleManager();

  const startScan = () => {
    setScanning(true);
    const discoveredDevices: any[] = [];
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setScanning(false);
        return;
      }

      if (device && !discoveredDevices.some((d) => d.id === device.id)) {
        discoveredDevices.push(device);
        setDevices([...discoveredDevices]);
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  useEffect(() => {
    return () => bleManager.destroy(); // Cleanup BLE manager on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bluetooth Devices</Text>
      <Button title={scanning ? 'Scanning...' : 'Scan for Devices'} onPress={startScan} disabled={scanning} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
  },
});

export default BluetoothScreen;
