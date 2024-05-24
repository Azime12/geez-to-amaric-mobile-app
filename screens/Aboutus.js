import React from "react";
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Linking } from "react-native";
import { Text, themeColor } from "react-native-rapi-ui";
import { Ionicons } from '@expo/vector-icons';

const AboutUsScreen = () => {
  const textAbout =
    "Our app seamlessly translates between Geez and Amharic using cutting-edge AI technology. Users can effortlessly convert text from scanned documents or images, or input directly into the app. With the ability to save translations for future references.";

  // Array of developers with names, emails, and LinkedIn profiles
  const developers = [
    { name: "Azimeraw Taddese", email: "azimeraw@example.com", linkedin: "https://www.linkedin.com/in/azimeraw-taddese-8b3015241" },
    { name: "Abrham Tafere", email: "abrham@example.com", linkedin: "https://www.linkedin.com/in/abrham/" },
    { name: "Bahiru Yimolal", email: "bahiru@example.com", linkedin: "https://www.linkedin.com/in/bahiru/" },
    { name: "Abel Mesfin", email: "abel@example.com", linkedin: "https://www.linkedin.com/in/abel/" },
    { name: "Banteamlak Gezahegn", email: "banteamlak@example.com", linkedin: "https://www.linkedin.com/in/banteamlak/" },
  ];

  // Render each developer item
  const renderDeveloperItem = ({ item }) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.linkedin)}>
      <View style={styles.developer}>
        <Image
          source={require("../assets/profile_12901975.png")} // Provide image paths for each developer
          style={styles.avatar}
        />
        <View style={styles.developerInfo}>
          <Text style={styles.name} >{item.name}</Text>
          <Text size="h6" style={{color:themeColor.primary300,}}>{item.email}</Text>
        </View>
        <Ionicons name="logo-linkedin" size={24} color={themeColor.primary600} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading} size="h3">
          About Us
        </Text>
        <Text style={[styles.description, styles.centeredDescription]}>
          {textAbout}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Developers</Text>
        <FlatList
          data={developers}
          renderItem={renderDeveloperItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    paddingLeft: 10,
  },
  heading: {
    justifyContent:"center",
    alignContent:'center',
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: themeColor.primary600,
    textAlign: "center", // Add this line to center align the text
  },  
  description: {
    fontSize: 16,
  },
  centeredDescription: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 10,
  },
  developer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  developerInfo: {
    flex: 1, // Added flex to ensure the text wraps properly
  },
  name: {
    fontSize: 16,
    marginBottom: 5, // Added marginBottom for spacing
  },
});

export default AboutUsScreen;
