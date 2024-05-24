import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";
import { Button, Text } from "react-native-rapi-ui";
import LottieView from "lottie-react-native";
import { BackHandler, StyleSheet, ToastAndroid, View } from "react-native";

// Configure Google Sign-In during app initialization
GoogleSignin.configure({
  androidClientId: "785815042177-adah4596i8pcfvp8mll4a8lilpqsiai2.apps.googleusercontent.com",
});

const LogoutComponent = () => {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const confirmLogout = async () => {
      try {
        signOut();
        setIsLoading(true);
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await Promise.all([
            GoogleSignin.revokeAccess(),
            GoogleSignin.signOut()
          ]);
        }
    
        // Navigate to the Onboarding screen or any other screen as per your app's flow
        ToastAndroid.show("Logout", ToastAndroid.SHORT);
        navigation.navigate('Onboarding');
        setIsLoading(false); // Fixed typo
      } catch (error) {
        setIsLoading(false); // Fixed typo
        console.error('Error during logout:', error);
      }
    };

  
  
    confirmLogout();
  }, [navigation, signOut]);
  const backHome=()=>{
    navigation.navigate('Home');
  }
  
  return (
    <View style={styles.container} >
      {isLoading ? (
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/animation/Animation - 1715537606824.json')} // Replace with your Lottie animation
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : (
        <>
          <Text>Something went wrong</Text>
          <Button text="Back to Home" status="primary" outline onPress={()=>{backHome()}}/>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LogoutComponent;
