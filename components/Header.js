import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import {  StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Text, theme } from 'galio-framework';
import argonTheme from '../constants/Theme';
const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
import { Ionicons,Feather } from '@expo/vector-icons';
import { themeColor } from 'react-native-rapi-ui';

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }
  renderRight = () => {
    const { white, title, navigation } = this.props;

   
  }
 
  
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Ionicons name="camera-outline" size={24} family="MaterialIcons" style={{ paddingRight: 8 }} color={themeColor.primary900} />
            <Text size={16}  style={{color:themeColor.primary900}}>{optionLeft || 'Camera'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Gallery')}>
          <Block row middle>
            <Ionicons size={24} name='image-outline'  family="MaterialIcons " style={{ paddingRight: 8,color:themeColor.primary900 }} />
            <Text size={16} style={{color:themeColor.primary900,}}>{optionRight || 'Gallery'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  
  renderHeader = () => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch() : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  }
  render() {
    const { back, title, white, transparent, bgColor, iconColor, titleColor, navigation, ...props } = this.props;

    const noShadow = ['Search', 'Profile'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor }
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
           back={false}
           title={title}
           style={navbarStyles}
           transparent={transparent}
           right={this.renderRight()}
           rightStyle={{ alignItems: 'center' }}
           left={
             <Feather 
               name={back ? 'chevron-left' : "menu"} family="entypo" 
               size={20} onPress={this.handleLeftPress} 
               color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
               style={{ marginTop: 2 }}
             />
               
           }
           leftStyle={{ paddingVertical: 12, flex: 0.2 }}
           titleStyle={[
             styles.title,
             { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
             titleColor && { color: titleColor }
           ]}
           {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    // paddingBottom: theme.SIZES.BASE * 1,
    paddingTop: iPhoneX ? theme.SIZES.BASE *2.5 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 8,
    marginTop: 7,
    elevation: 0,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '500',
    color: argonTheme.COLORS.HEADER
  },
});

export default withNavigation(Header);
