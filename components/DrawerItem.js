import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import argonTheme from "../constants/Theme";
import { themeColor } from "react-native-rapi-ui";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? "white" : themeColor.info600}
            />
        );
        case "Profile":
          return (
            <Icon
              name="chart-pie-35"
              family="ArgonExtra"
              size={14}
              color={focused ? "white" : argonTheme.COLORS.WARNING}
            />
          );
      case "Favorite":
        return (
          <Icon
            name="favorite"
            family="Fontisto"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.ERROR}
          />
        );
        case "About Us":
        return (<Icon
          name="spaceship"
          family="ArgonExtra"
          size={14}
          color={focused ? "white" : themeColor.primary500}
        />);
      case "Logout":
        return (
          <Icon
            name="logout"
            family="AntDesign"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
   
      // case "Account":
      //   return (
      //     <Icon
      //       name="calendar-date"
      //       family="ArgonExtra"
      //       size={14}
      //       color={focused ? "white" : argonTheme.COLORS.INFO}
      //     />
      //   );
      
      // case "Log out":
      //   return <Icon />;
      default:
        return null;
    }
  };

  render() {
    const { focused, title, navigation } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <TouchableOpacity
        style={{ height: 60 }}
        onPress={() =>
          title == "Getting Started"
            ? Linking.openURL(
                "https://demos.creative-tim.com/argon-pro-react-native/docs/"
              ).catch(err => console.error("An error occurred", err))
            : navigation.navigate(title)
        }
      >
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              color={focused ? "white" : "black"}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: "#3690ED", // Change this color to your desired color
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});


export default DrawerItem;
