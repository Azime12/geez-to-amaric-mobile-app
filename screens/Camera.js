import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'; // Importing media library module

export default function CameraExample() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setCapturedPhoto(photo);
      savePhoto(photo);
    }
  };

  const savePhoto = async (photo) => {
    if (Platform.OS === 'ios') {
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      MediaLibrary.createAlbumAsync('Expo', asset)
        .then(() => {
          console.log('Photo saved to album');
        })
        .catch(error => {
          console.log('Error saving photo to album:', error);
        });
    } else {
      const { status } = await MediaLibrary.requestPermissionsAsync(); // Request media library permissions
      if (status === 'granted') {
        MediaLibrary.saveToLibraryAsync(photo.uri)
          .then(() => {
            console.log('Photo saved to gallery');
          })
          .catch(error => {
            console.log('Error saving photo to gallery:', error);
          });
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={cameraType} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setCameraType(
            cameraType === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          )}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
        <View style={{ flex: 1 }}>
          <Text>Captured Photo:</Text>
          <View style={{ flex: 1 }}>
            <Image source={{ uri: capturedPhoto.uri }} style={{ flex: 1 }} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.5,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
