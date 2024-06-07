import React, { useCallback, useContext, useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";
import { argonTheme } from "../constants";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Layout, Text } from "react-native-rapi-ui";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";
import { TextInput, themeColor } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const AmharicDialog = ({ amharicText, geezText, isVisible, toggleModal }) => {
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    showToast();
    console.log("Copied text:", text);
  };

  function showToast() {
    ToastAndroid.show("Copied", ToastAndroid.SHORT);
  }

  const CustomDivider = () => {
    return <View style={styles.divider} />;
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <ScrollView>
        <View style={styles.modalContainer}>
          
          
          <TouchableOpacity onPress={toggleModal} style={{display:'flex',flexDirection:'row',justifyContent:'left'}}>
           <Ionicons name="close" size={30} style={{top:15,left:-125}}/>
            </TouchableOpacity>
            <Text
              size="h3"
              style={{
                fontWeight: "700",
                color: themeColor.primary700,
                // marginTop:5
              }}
            >
              Geez
            </Text>
            <View style={styles.modalTextContainer}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(geezText)}
              >
                <Ionicons
                  name="copy"
                  size={30}
                  style={{ padding: 5,color:themeColor.info800}}
                  // family="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>{geezText}</Text>
            </View>
            <CustomDivider />
            <Text
              size="h3"
              style={{
                fontWeight: "700",
                
                color: themeColor.primary700,
              }}
            >
              Amharic
            </Text>
            <View style={styles.modalTextContainer}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(amharicText)}
              >
                <Ionicons
                  name="copy"
                  size={30}
                  style={{ padding: 5,marginTop:10,color:themeColor.info800}}
                  family="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>{amharicText}</Text>

            </View>
            
          </View>

      </ScrollView>
    </Modal>
  );
};

const ListItem = ({ item, onDelete }) => {
  const words = item.amharic.split(" ");
  const title = words.slice(0, 2).join(" ");

  return (
    <View style={styles.listItem}>
      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.favoriteButton}
          >
            <Fontisto name="favorite" size={24} color={"#FF6500"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item.geez}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.amharic}
        </Text>
      </View>
    </View>
  );
};

const Favorite = () => {
  const { user, signOut } = useContext(AuthContext);
  const [userinfo, setUser] = useState(JSON.parse(user));
  const [items, setItems] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const toggleModal = (item) => {
    setSelectedItem(item);
    setIsVisible(!isVisible);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log("token",userinfo.token)
        try {
          const response = await fetch(
            `https://geeztoamharic.onrender.com/api/users/favorite/${userinfo.user_info.user_id}`,
            {
              headers: {
                Authorization: `Bearer ${userinfo.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          console.log("favorite data", json);
          setItems(json);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          Alert.alert(
            "Error",
            "An error occurred while fetching data. Please try again."
          );
          setLoading(false);
        }
        setLoading(false);

      };

      fetchData();
    }, [userinfo])
  );

  useEffect(() => {
    if (items) {
      const filteredResults = items.filter((item) => {
        return (
          item.amharic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.geez.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredItems(filteredResults);
    }
  }, [searchQuery, items]);

  const handleDelete = async (userId, textId) => {
    console.log("token",userinfo.token);
    
    try {
      const response = await fetch(
        "https://geeztoamharic.onrender.com/api/users/favorite",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userinfo.token}`,
          },
          body: JSON.stringify({
            user_id: userinfo.user_info.user_id,
            text_id: textId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data deleted:", data);
      ToastAndroid.show("Favorite Removed", ToastAndroid.SHORT);

      const updatedItems = items.filter((item) => item.id !== textId);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting data:", error);
      Alert.alert(
        "Error",
        "An error occurred while deleting data. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={(val) => setSearchQuery(val)}
          rightContent={
            <Ionicons name="search" size={20} color={themeColor.danger600} />
          }
          style={styles.searchInput}
        />
      </View>
      <ScrollView>
        <View style={styles.listContainer}>
          {!loading ? (
            items && filteredItems.length > 0 ? ( // Check if items exist and filteredItems is not empty
              filteredItems.map((item) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleModal(item)}
                  >
                    <ListItem
                      item={item}
                      onDelete={(textId) =>
                        handleDelete(userinfo.user_info.user_id, textId)
                      }
                    />
                  </TouchableOpacity>
                  <AmharicDialog
                    isVisible={
                      isVisible && selectedItem && selectedItem.id === item.id
                    }
                    toggleModal={toggleModal}
                    amharicText={item.amharic}
                    geezText={item.geez}
                  />
                </React.Fragment>
              ))
            ) : (
              <Text>Your Favorite Data empty</Text> // Display "Data not found"
            )
          ) : (
            // <ActivityIndicator size={"large"} />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
            <LottieView
              source={require('../assets/animation/Animation - 1715537606824.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
          
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#999",
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalContent: {
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    
    alignItems: "center",
  },
  modalTextContainer: {
    flex: 1,
    width: "100%",
    borderRadius:2,
    borderColor:themeColor.black200,
    // marginTop: 10, // Adjust as needed
    borderWidth: 1,
    borderColor: "#ccc", // Change the border color as needed
    padding: 10, // Add padding for better visual appearance
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 5,
    // paddingVertical:30,
    marginHorizontal:20,
  },
  modalHeader: {
    color: argonTheme.COLORS.ICON,
    fontSize: 26,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
    color: "red",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    marginVertical: 10,
  },
  copyButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    color: "blue",
  },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 3,
  },
  searchInput: {
    marginHorizontal: 20,
    padding: 2,
  },
  favoriteButton: {
    position: "absolute",
    right: 0,
  },
});

export default Favorite;
