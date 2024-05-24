
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';



// npx expo install @react-native-google-signin/google-signin
// npx expo install expo-dev-client

export default function App() {
  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();
  

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      androidClientId:
        "614987848037-hhp4o0f3fn5coeu2cshu3pnltis4shqt.apps.googleusercontent.com",
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const signIn = async () => {
    console.log("Pressed sign in");
  
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError();
  
      // Store user info locally
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  
      // Navigate to the main page
      navigateToMainPage(); // Implement this function to navigate to the main page
    } catch (e) {
      setError(e);
    }
  };
  

  const logout = async () => {
    setUserInfo(null);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  
    // Remove user info from local storage
    await AsyncStorage.removeItem('userInfo');
  
    // Navigate to the login page
    navigateToLoginPage(); // Implement this function to navigate to the login page
  };
  

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(error)}</Text>
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});