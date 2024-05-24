import React, { useState, useEffect, useRef, useContext } from "react";
import mime from "mime";
import {
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
import { Button, themeColor } from "react-native-rapi-ui";
import { AuthContext } from "../components/AuthContext";
import { Text } from "react-native-rapi-ui";
import LottieView from "lottie-react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Pro() {
  const { user,signOut } = useContext(AuthContext);
  const [userinfo,setUser]=useState(JSON.parse(user));
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [processed, setProcessed] = useState(null);


  useEffect(() => {
   
    if(!user){
      navigation.navigate('App');
    }

},[user])
  
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
        <Text style={{ textAlign: "center",color:themeColor.info800 ,marginTop:50}} size="h4">
To Aceess Camera you need give permission!
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
        const { uri } = await cameraRef.current.takePictureAsync({quality:0.7});
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
    console.log("New image URI:", newImageUri);
  
    const formData = new FormData();
    formData.append('file', {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop()
    });
  
    try {
      const response = await fetch('https://geeztoamharic.onrender.com/api/users/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userinfo.token}` 
        },
        body: formData,
      });
  
      if (!response.ok) {
        setIsLoading(false);
        ToastAndroid.show('Failed to send photo to server', ToastAndroid.SHORT);
        throw new Error('Failed to send photo to server');
      }
  
      const responseData = await response.json();
      console.log("Response data:", responseData);
      setIsLoading(false);
      closeModal();
      navigation.navigate('Home', { responseText: responseData.processed_text }); 
    
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
              <Modal
              animationType="fade"
              transparent={true}
              visible={isLoading}
              // onRequestClose={() => {
              //   // Do nothing, or handle the modal close action
              // }}
            >
              <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                  {/* <ActivityIndicator animating={true} color="blue" size="large" /> */}
                  <LottieView
              source={require('../assets/animation/Animation - 1715537606824.json')} // Replace with your Lottie animation
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
                </View>
              </View>
            </Modal>
          ) : (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.modalImage}
              />
              <View style={styles.buttonRow}>
              <Button text="Save" onPress={savePhoto} style={{paddingHorizontal:30,color:themeColor.info800}} status="info" outline/>
               <Button text="Retake" onPress={retakePhoto} style={{paddingHorizontal:20,color:themeColor.info800}} status="danger" outline/>
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicatorWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 20,
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
    fontSize: 15,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageContainer: {
    width:'100%',
    height:'100%',
    position:'absolute',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.75,
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
