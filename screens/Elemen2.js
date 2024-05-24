import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Modal, ScrollView, Dimensions } from "react-native";
import { Icon } from "../components/";
import { argonTheme } from "../constants/";
import * as Clipboard from "expo-clipboard";

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
          <View style={styles.modalContent}>
            <Text size={22} color={argonTheme.COLORS.ICON}>
              Geez
            </Text>
            <View style={styles.modalTextContainer}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(geezText)}
              >
                <Icon
                  name="content-copy"
                  size={30}
                  style={{ padding: 5 }}
                  family="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <Text style={styles.modalTextBorder}>{geezText}</Text>
            </View>
            <CustomDivider/>
            <Text size={22} color={argonTheme.COLORS.ICON}>
              Amharic
            </Text>
            <View style={styles.modalTextContainer}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(amharicText)}
              >
                <Icon
                  name="content-copy"
                  size={30}
                  style={{ padding: 5 }}
                  family="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <Text style={styles.modalTextBorder}>{amharicText}</Text>
            </View>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const Elements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [favorite, setFavorite] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = (item) => {
    setSelectedItem(item);
    setIsVisible(!isVisible);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    const message = favorite ? "Favorite Removed" : "Favorite Added";
    showToast(message);
  };

  function showToast(message) {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      geez: `Example Text ExampleText Example Text ExampleText ExampleText Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text`,
      amharic: `Example Text ExampleText Example Text ExampleText ExampleText Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text`,
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      geez: `Example Text ExampleText Example Text ExampleText ExampleText Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text`,
      amharic: `Example Text ExampleText Example Text ExampleText ExampleText Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text`,
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      geez: `Example Text ExampleText Example Text ExampleText ExampleText Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text`,
      amharic: `Example Text ExampleText Example Text ExampleText ExampleText Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text 
      Example Text Example Text Example Text Example Text Example Text Example Text`,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, width: Dimensions.get("screen").width }}
      >
        {DATA.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => toggleModal(item)}>
            <View style={styles.itemContainer}>
              <Icon
                name={favorite ? "check-square" : "checksquare"}
                family={favorite ? "Feather" : "AntDesign"}
                size={40}
                color={argonTheme.COLORS.ICON}
                style={styles.icon}
                onPress={handleFavorite}
              />
              <Text style={styles.text} numberOfLines={2}>{item.geez}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <AmharicDialog
        isVisible={isVisible}
        toggleModal={toggleModal}
        amharicText={selectedItem ? selectedItem.amharic : ""}
        geezText={selectedItem ? selectedItem.geez : ""}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    padding: 10,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: argonTheme.COLORS.BLACK,
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  copyButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    color: "blue",
  },
  closeButton: {
    marginTop: 10,
    color: "red",
  },
  modalTextContainer: {
    borderColor: argonTheme.COLORS.GRADIENT_END,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalTextBorder: {
    padding: 10,
  },
});

export default Elements;
