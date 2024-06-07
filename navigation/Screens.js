import {  Dimensions, Easing } from "react-native";
import { Header,  } from "../components";
import CustomDrawerContent from "./Menu";
import Elements from "../screens/Elements";
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import React, {  useContext } from "react";
import Register from "../screens/Register";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Gallery from "../screens/Gallery";
import LogoutComponent from "../screens/Logout";
const { width } = Dimensions.get("screen");
import Login from "../screens/Login";
import { AuthContext } from "../components/AuthContext";
import AboutUsScreen from "../screens/Aboutus";


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


function ElementsStack(props) {
  const {user}=useContext(AuthContext);

  return (
    <>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            mode: "card",
            headerShown: "screen",
          }}
          initialRouteName="Favorite"
        >
          <Stack.Screen
            name="Favorite"
            component={Elements}
            options={{
              header: ({ navigation, scene }) => (
                <Header
                  title="Favorite"
                 
                />
              ),
              cardStyle: { backgroundColor: "#F8F9FE" },
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            option={{
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
}

function RegStack(props) {
  const {user}=useContext(AuthContext);

  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      screenOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Account"
    >
      {!user ? (
        <>
          <Drawer.Screen
            name="Account"
            component={Register}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={({ navigation }) => ({
              headerShown: false,
              navigation: navigation,
            })}
          />
        </>
      ) : (
        <Drawer.Screen
          name="App"
          component={AppStack}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Drawer.Navigator>
  );
}

function HomeStack(props) {
  const {user}=useContext(AuthContext);

  return (
    <>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            mode: "card",
            headerShown: "screen",
          }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              header: ({ navigation, scene }) => (
                <Header
                  title="Home"
                  // search
                  options
                  navigation={navigation}
                  scene={scene}
                  // titleColor={"#FFFFFF"}
                />
              ),
              cardStyle: { backgroundColor: "#F8F9FE" },
            }}
          />

          <Stack.Screen
            name="Pro"
            component={Pro}
            options={{
              header: ({ navigation, scene }) => (
                <Header
                  title=""
                  back
                  white
                  transparent
                  navigation={navigation}
                  scene={scene}
                />
              ),
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Gallery"
            component={Gallery}
            options={{
              header: ({ navigation, scene }) => (
                <Header
                  title="Upload photo"
                  back
                  // white
                  transparent
                  navigation={navigation}
                  scene={scene}
                />
              ),
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Screen>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            option={{
              headerTransparent: true,
            }}
          />
        </Stack.Screen>
      )}
    </>
  );
}

export default function OnboardingStack(props) {
  const {user}=useContext(AuthContext);

  console.log("auth in onBoarding:", user);
  return (
    
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      
     
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Account"
            component={Register}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="App" component={AppStack} />
        
     
    </Stack.Navigator>
  );
}

function AppStack(props) {
  const {user}=useContext(AuthContext);

  return (

    <>
    {
      user?
      <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      screenOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      
        <>
          <Drawer.Screen
            name="Home"
            component={HomeStack}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={({ navigation }) => ({
              headerShown: false,
              navigation: navigation,
            })}
          />
           <Drawer.Screen
            name="About Us"
            component={AboutUsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Logout"
            component={LogoutComponent}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Favorite"
            component={ElementsStack}
            options={{
              headerShown: false,
            }}
          />
        </>
  
    </Drawer.Navigator>
    :
  
     <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{
            headerTransparent: true,
          }}
        />

  
    }
    </>
  )
}
