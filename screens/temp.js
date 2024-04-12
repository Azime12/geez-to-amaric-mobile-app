import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView, TextInput } from "react-native";
import { Block, theme } from "galio-framework";
import { Card } from "../components";
import articles from "../constants/articles";

const { width } = Dimensions.get("screen");

const Home = ({ route }) => {
  // Destructure processed_text from route.params with a default value of an empty string
  const { processed_text = "" } = route.params;

  // State to hold the processed text
  const [processedText, setProcessedText] = useState("");

  useEffect(() => {
    // Set the processed text when the component mounts or when route.params changes
    setProcessedText(processed_text);
  }, [processed_text]);

  return (
    <Block flex center style={styles.home}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {/* Render TextInput with processedText as its value */}
          <TextInput
            value={processedText}
            style={styles.textInput}
            placeholder="Type Geez Text"
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />
          {/* Render Card component passing textFromimage prop */}
          <Card item={articles[4]} full textFromimage={processedText} />
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.COLORS.WARNING,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10, // Add some margin to separate TextInput and Card
  },
});

export default Home;
