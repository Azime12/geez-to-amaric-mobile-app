import React, { useState, useEffect, useContext } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, ToastAndroid,Dimensions, Modal,ActivityIndicator} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-rapi-ui";
import { AuthContext } from "../components/AuthContext";
import LottieView from "lottie-react-native";


const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

const UploadImageExample = () => {  
  const { user,signOut } = useContext(AuthContext);
  const [userinfo,setUser]=useState(JSON.parse(user));
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Permission to access camera roll is required!", ToastAndroid.SHORT);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      pickImage();
    });

    return unsubscribe;
  }, [navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.6,
    });
  if (!result.cancelled && result.assets.length > 0) {
    const selectedAsset = result.assets[0];
    setSelectedImage(selectedAsset.uri);
  }
  };




  const uploadImage = async () => { 
    
    // console.log("tesseract text from image:",tesseracet);

    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      setIsLoading(true);
      const response = await fetch("https://geeztoamharic.onrender.com/api/users/ocr", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${userinfo.token}` 
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send photo to server");
      }
      const responseData = await response.json();
      navigation.navigate('Home', { responseText: responseData.processed_text });
      setIsLoading(false);

      ToastAndroid.show("Image uploaded successfully!", ToastAndroid.SHORT);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending photo to server:", error.message);
      ToastAndroid.show("Failed to upload image. Please try again.", ToastAndroid.SHORT);
    }
  };

  const cancelUpload = () => {
    setSelectedImage(null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
          {selectedImage &&
            <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />
          }
          {isLoading && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={isLoading}
            >
              <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                  <LottieView
                    source={require('../assets/animation/Animation - 1715537606824.json')} // Replace with your Lottie animation
                    autoPlay
                    loop
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              </View>
            </Modal>
          )}
          {selectedImage && (
            <View style={styles.buttonsContainer}>
              <Button text="Upload" onPress={uploadImage} style={styles.button} status="primary"  />
              <Button text="Cancel" onPress={cancelUpload} style={styles.button} status="danger"  />
            </View>
          )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1, // Take up full screen height
    width: screenWidth, // Full width of the screen
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  activityIndicatorWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenHeight,
    margin: 20, // Add margin around the image
    padding: 20, // Add padding around the image
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingHorizontal: 20,
  },
});

export default UploadImageExample;