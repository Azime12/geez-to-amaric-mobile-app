import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet } from "react-native";

import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import React from "react";
import { argonTheme } from "../constants";
import { Divider } from "@rneui/base";


function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const screens = [
    { title: "Home", key: "Home" },
    { title: "Profile", key: "Profile" },
    { title: "Favorite", key: "Favorite" },
    { title: "About Us", key: "AboutUs" },
 
  ];  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
           <Block flex={0.2} style={styles.header}>
        <Image style={styles.logo} source={Images.Logo} />
      </Block>
      <Block flex style={{ marginTop:-30,paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item) => (
            <DrawerCustomItem
              key={item.key}
              title={item.title}
              navigation={navigation}
              focused={state.routes[state.index].name === item.title}
            />
          ))}
          <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "100%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
          </Block>
          <DrawerCustomItem title="Logout" navigation={navigation} />
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:argonTheme.COLORS.WHITE
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center",
    backgroundColor:argonTheme.COLORS.WHITE
  
  },
});

export default CustomDrawerContent;
