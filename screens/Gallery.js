
  import React, { useState, useEffect } from 'react';
  import { View, Image, StyleSheet, Dimensions, TouchableOpacity,Text } from 'react-native';
  import { Button } from '../components';
  import * as ImagePicker from 'expo-image-picker';
  import { useNavigation } from "@react-navigation/native";

  
  const UploadImageExample = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation();

   
useEffect(() => {
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [width, height], // Set aspect ratio to match screen dimensions
        quality: 1,
      });

     

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri); // Access the URI from the assets array
        console.log('uri', result.assets[0].uri);
      } else {
// navigation.goBack();
    }
    };
    
  
    pickImage();
  }, []);
  
    const uploadImage = async () => {
      // Add your upload functionality here
      navigation.navigate('Home',{})
      console.log('Uploading image:', selectedImage);
    };
  
    const cancelUpload = () => {
      setSelectedImage(null); // Clear selected image
      navigation.goBack();
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />
          ) : (
           <></>
          )}
        </View>
        {selectedImage && (
          <View style={styles.buttonsContainer}>
            <Button title="Upload" color="info" onPress={uploadImage} >
                <Text>Upload</Text>
            </Button>
            <Button title="Cancel" color="error" onPress={cancelUpload} >
                <Text> Cancel</Text>
            </Button>
          </View>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    noImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingBottom: 20, // Add padding to lift the buttons above the bottom of the screen
    },
  });
  
  export default UploadImageExample;
  