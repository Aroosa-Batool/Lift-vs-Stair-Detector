import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Ensure you've installed @expo/vector-icons

const GoingDown = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="angle-double-down" size={100} color="#530430" style={styles.bounce} />
      </View>
      <Text style={styles.title}>You're Going Down!</Text>
      <View style={styles.arrowContainer}>
        <Image
          source={{ uri: 'https://img.icons8.com/?size=100&id=WalKi77wMcLV&format=png&color=000000' }}
          style={styles.arrowImage}
        />
      </View>
      <Text style={styles.subtitle}>Stay safe and enjoy your journey!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff', // Light blue
  },
  iconContainer: {
    marginBottom: 20,
  },
  bounce: {
    // Bounce animation can be added with react-native-reanimated or Lottie
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Dark blue
    marginBottom: 10,
  },
  arrowContainer: {
    marginVertical: 20,
  },
  arrowImage: {
    width: 100,
    height: 100,
  },
  subtitle: {
    fontSize: 16,
    color: '#901e1e', // Red text
  },
});

export default GoingDown;
