import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualRegister = async () => {
    try {
      const response = await fetch('http://your-backend-url/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        await AsyncStorage.setItem('token', token);
        navigation.navigate('AuthenticatedScreens');
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Error', 'An error occurred while registering. Please try again.');
    }
  };

  const handleGoogleRegister = async (idToken) => {
    try {
      const response = await fetch('http://your-backend-url/api/register/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const { token } = await response.json();
        await AsyncStorage.setItem('token', token);
        navigation.navigate('AuthenticatedScreens');
      } else {
        Alert.alert('Error', 'An error occurred while registering with Google');
      }
    } catch (error) {
      console.error('Error registering with Google:', error);
      Alert.alert('Error', 'An error occurred while registering with Google');
    }
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleRegister(id_token);
    }
  }, [response]);

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleManualRegister} />
      <Button title="Register with Google" onPress={() => promptAsync()} />
    </View>
  );
};

export default RegisterScreen;
