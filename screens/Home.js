import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Dimensions,
  Alert,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Icon } from "../components";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { argonTheme } from "../constants";
import { Block, theme } from "galio-framework";
import * as Clipboard from "expo-clipboard";
import { useRoute } from "@react-navigation/native";
import { Fontisto, Feather } from "@expo/vector-icons";
import { AuthContext } from "../components/AuthContext"; // Import your AuthContext
import {
  Layout,
  Text,
  themeColor,
  TextInput,
  Button,
} from "react-native-rapi-ui";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const { user } = useContext(AuthContext);
  const [geezText, setGeezText] = useState("");
  const [amharicText, setAmharicText] = useState("");
  const route = useRoute();
  const geezTexeGallery = route.params;
  const Navigation=useNavigation();

  useEffect(() => {
   
    if(!user){
      Navigation.navigate('Onboarding');
    }

},[user])


  useEffect(() => {
    console.log("processed text from home", geezTexeGallery);
    if (geezTexeGallery && geezTexeGallery.responseText) {
      console.log("geezTextGallery", geezTexeGallery.responseText.join(""));
      setGeezText(geezTexeGallery.responseText.join(""));
      console.log("geezTexsdfasdt Am", geezText);
    }
    console.log("Geez text akfja one ", geezText);
  }, [geezTexeGallery]);

  const handleGeezText = (text) => {
    setGeezText(text);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text); // Pass the text parameter here
    ToastAndroid.show("copied", ToastAndroid.SHORT);
  };

//Translation of handle
  const handleTranslation = async () => {
    setAmharicText(am);
    try {
      const requestBody = {
        geez: geezText,
      };
      const response = await fetch(
        "https://geeztoamharic.onrender.com/api/users/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
              'Authorization': `Bearer ${userData.token}` 
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success === "True") {
          ToastAndroid.show("Favorite Added", ToastAndroid.SHORT);
      
        } else {
          // If response is successful but does not contain success and token, handle the error
          Alert.alert(
            "Error",
            "Favorite could not be added.or check your connection Please try again."
          );
        }
      } else {
        // If response status is not OK, handle the error
        try {
          const errorData = await response.json();
          Alert.alert("Error", errorData.message);
        } catch (error) {
          console.error("Error parsing error response:", error);
          Alert.alert(
            "Error",
            "An error occurred while processing the response. Please try again."
          );
        }
      }
    } catch (error) {
          Alert.alert("Error", " Please try again.");
    }
    
  };

  const handleFavorite = async (geezText, amharicText) => {
    const userData = JSON.parse(user);

    
    try {
      const requestBody = {
        user_id: userData.user_info.user_id, // Access user_id from user_info
        geez: geezText,
        amharic: amharicText,
      };
      const response = await fetch(
        "https://geeztoamharic.onrender.com/api/users/favorite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
              'Authorization': `Bearer ${userData.token}` 
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success === "True") {
          ToastAndroid.show("Favorite Added", ToastAndroid.SHORT);
      
        } else {
          // If response is successful but does not contain success and token, handle the error
          Alert.alert(
            "Error",
            "Favorite could not be added.or check your connection Please try again."
          );
        }
      } else {
        // If response status is not OK, handle the error
        try {
          const errorData = await response.json();
          Alert.alert("Error", errorData.message);
        } catch (error) {
          console.error("Error parsing error response:", error);
          Alert.alert(
            "Error",
            "An error occurred while processing the response. Please try again."
          );
        }
      }
    } catch (error) {
          Alert.alert("Error", " Please try again.");
    }
  };

  const am = `selam ማነው ለመጀመሪያ ጊዜ በእስራኤል ላይ በፈጸመችው ቀጥተኛ መጠነ ሰፊ ጥቃት ከ300 በላይ ሚሳኤል እና ድሮኖች መወንጨፋቸውን የእስራኤል ሠራዊት አስታወቀ።

  ከ300 በላይ የሚሆኑት ሚሳኤሎች እና ድሮኖች ከኢራን፣ ኢራቅ እና ከየመን ወደ እስራኤል የተተኮሱ ሲሆን፣ ከእነዚህ ተወንጫፊዎች አብዛኞቹ ጉዳት ሳያደርሱ በእስራኤል እና በወዳጆቿ አማካይነት እንዲከሽፉ መደረጋቸው ተነግሯል።
  
  የእስራኤል ወታደራዊ ኃይል ቃል አቀባይ ሌተናል ኮሎኔል ፒተር ለርነር ለቢቢሲ እንደተናገሩት “360 የተለያዩ ተወንጫፊዎች ወደ እስራኤል ተተኩሰው ነበር።`;

  const Divider = () => {
    return <View style={styles.divider} />;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30, screenWidth }}
    >
      <Block>
        <Layout backgroundColor="#f7f7f7">
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              margin: 5,
              borderRadius: 6,
            }}
          >
            <Text
              size="h3"
              style={{
                fontWeight: "700",
                color: themeColor.primary700,
              }}
            >
              Geez Text
            </Text>
          </View>
          <View style={{ margin: 10 }}>
            <TextInput
              value={geezText}
              onChangeText={handleGeezText}
              placeholder="Type Geez Text"
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>
          <View style={{ margin: 10 }}>
            <Button text="Translate" onPress={handleTranslation} style={{}} />
          </View>
        </Layout>

        <Divider />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            // backgroundColor: "#be4d25",
            margin: 5,
            borderRadius: 6,
          }}
        >
          <Text
            size="h3"
            style={{
              fontWeight: "700",
              color: themeColor.primary700,
            }}
          >
            Amharic Text
          </Text>
        </View>
        {amharicText ? (
          <Layout
            style={{
              borderColor: themeColor.black100,
              // borderWidth:1,
              borderRadius: 3,

              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",

                marginTop: -5,
              }}
            >
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => copyToClipboard(amharicText)}
              >
                <Feather
                  style={{
                    padding: 4,
                    marginRight: 10,
                    marginTop: 4,
                    opacity: 0.5,
                  }}
                  name="copy"
                  size={36}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleFavorite("  ከ300 በላይ የሚሆኑት ሚሳኤሎች እና ድሮኖች ከኢራን፣ ኢራቅ እና ከየመን ወደ እስራኤል የተተኮሱ ሲሆን፣ ከእነዚህ ተወንጫፊዎች አብዛኞቹ ጉዳት ሳያደርሱ በእስራኤል እና በወዳጆቿ አማካይነት እንዲከሽፉ መደረጋቸው ተነግሯል። ",
                   amharicText);
                }}
              >
                <Fontisto
                  size={30}
                  name="favorite"
                  style={{ padding: 4, marginRight: 10, marginTop: 4 }}
                  color={argonTheme.COLORS.ICON}
                />
              </TouchableOpacity>
            </View>
            <View style={{ margin: 5 }}>
              <TouchableWithoutFeedback>
                <Text
                  size="h4"
                  selectable={true}
                  value={amharicText}
                  style={{ color: argonTheme.COLORS.BLACK, padding: -10 }}
                >
                  {amharicText}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </Layout>
        ) : (
          ""
        )}
        <View style={{ height: 100 }} />
      </Block>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2187ab",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)", // You can adjust the color and opacity
    marginVertical: 10, // Adjust the vertical margin as needed
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
  },
  shadow: {
    shadowOpacity: 0,
  },
  textInput: {
    borderWidth: 1,
    margin: 20,
    borderColor: theme.COLORS.WARNING,
    borderRadius: 10,
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: "#2187ab",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginLeft: "auto",
  },
});
