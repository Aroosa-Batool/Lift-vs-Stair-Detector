import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Use an icon library like Expo Icons

const GoingUp = () => {
  return (
    <View style={styles.container}>
      {/* Bouncing Icon */}
      <View style={styles.bounce}>
        <FontAwesome5 name="chevron-up" size={100} color="#530430" />
      </View>
      {/* Title */}
      <Text style={styles.title}>You're Going Up using stairs!</Text>
      {/* Arrow GIF */}
      <Image
        source={{
          uri: "https://img.icons8.com/?size=100&id=WalKi77wMcLV&format=png&color=000000",
        }}
        style={styles.arrow}
      />
      {/* Subtitle */}
      <Text style={styles.subtitle}>Stay safe and enjoy your journey with stairs!</Text>
    </View>
  );
};

export default GoingUp;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FBEFEF",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    bounce: {
      marginBottom: 20,
      animation: "bounce 2s infinite", // Add animation logic below
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#530430",
      textAlign: "center",
      marginVertical: 20,
    },
    arrow: {
      width: 100,
      height: 100,
      marginVertical: 20,
    },
    subtitle: {
      fontSize: 18,
      color: "#333",
      textAlign: "center",
    },
  });
  