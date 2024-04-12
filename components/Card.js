import React, { useState, useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

import { argonTheme } from "../constants";

const Card = ({ navigation, item, horizontal, full, style, ctaColor, imageStyle, textFromimage }) => {
  const [text, setText] = useState(textFromimage || '');

  useEffect(() => {
    setText(textFromimage);
    console.log('text',text)
  }, [textFromimage]);

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleTranslate = () => {
    console.log(text);
  };

  return (
    <Block row={horizontal} card flex style={[styles.card, styles.shadow, style]}>
      <TextInput
        value={textFromimage}
        onChangeText={handleTextChange}
        style={[styles.textInput, { borderColor: argonTheme.COLORS.PRIMARY }]}
        placeholder="Type Geez Text"
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
      />

      <Button style={styles.buttonContainer} onPress={handleTranslate}>
        <Text style={{ color: theme.COLORS.WHITE }} size={16} bold>
          Translate
        </Text>
      </Button>
    </Block>
  );
};

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
  textFromimage: PropTypes.string,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
  },
  shadow: {
    shadowOpacity: 0,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.COLORS.WARNING,
    borderRadius: 10,
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: theme.COLORS.PRIMARY,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },
});

export default withNavigation(Card);
