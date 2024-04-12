import React, { useState, useEffect, useRef } from "react";
import mime from "mime";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { Icon } from "galio-framework";
import { useNavigation } from "@react-navigation/native";
import { ToastAndroid } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Pro() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraType() {
    setType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const { uri } = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(uri);
        setModalVisible(true);
        cameraRef.current.pausePreview();
      }
    } catch (error) {
      console.error('Error taking picture:', error.message);
      ToastAndroid.show('Error taking picture', ToastAndroid.SHORT);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  };

  const savePhoto = async () => {
    setIsLoading(true);
    console.log("Sending photo to server...");
    
    const newImageUri = "file:///" + capturedPhoto.split("file:/").join("");
    const formData = new FormData();
    formData.append('file', {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop()
    });
  
    try {
      const response = await fetch('http://10.2.84.160:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!response.ok) {
        ToastAndroid.show('Failed to send photo to server', ToastAndroid.SHORT);
        throw new Error('Failed to send photo to server');
      }
  
      const responseData = await response.json();
      console.log("responseDAta",responseData)
      console.log("responseData.processed_text",responseData.processed_text)
      console.log("Photo sent successfully");
      setIsLoading(false);
      closeModal();
      navigation.navigate('Home', { processed_text: responseData ? responseData.processed_text : null });
    } catch (error) {
      console.error('Error sending photo to server:', error.message);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      setIsLoading(false);
    }
  };
  

  const retakePhoto = () => {
    setCapturedPhoto(null);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={type} ref={cameraRef} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Icon
              name="cameraswitch"
              family="MaterialIcons"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Icon
              name="motion-photos-on"
              family="MaterialIcons"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.modalImage}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={savePhoto}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={retakePhoto}
                >
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  button: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  modalImage: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.6,
    marginBottom: 20,
  },
  cancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#0000ff",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
