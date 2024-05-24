import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function LottieSplashScreen({ onAnimationFinish }) {
  useEffect(() => {
    onAnimationFinish(); // Notify the parent component when the animation finishes
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animation/Animation - 1715457333483 (1).json")}
        autoPlay
        loop={false} // Set loop to false so the animation only plays once
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
