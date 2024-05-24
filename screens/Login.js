import React, { useState,useEffect, useContext } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../components/AuthContext";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  // const auth = getAuth();
  const { user,signIn } = useContext(AuthContext);
  const Navigation = useNavigation(); // useNavigation hook from react-navigation

  

  const [loading, setLoading] = useState(false);
  const [showPasswordC, setShowPasswordC] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);


  useEffect(() => {
   
    if(user){
      Navigation.navigate('App');
    }

},[user])



    useEffect(() => {
   
      if(user){
        Navigation.navigate('App');
      }
  
  },[user])

    const togglePasswordVisibilityC = () => {
      setShowPasswordC((prevShowPassword) => !prevShowPassword);
    };

  
   
    const signWithGoogle = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await Promise.all([
          GoogleSignin.revokeAccess(),
          GoogleSignin.signOut()
        ]);
      }
      
      const configureGoogleSignIn = () => {
        GoogleSignin.configure({
          androidClientId:
            "785815042177-adah4596i8pcfvp8mll4a8lilpqsiai2.apps.googleusercontent.com",
        });
      };
      configureGoogleSignIn();
      console.log("login sign click");
      setShowLoadingModal(true);
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log("userInfo", userInfo);
        await sendUserInfoToServer(userInfo);
      } catch (error) {
        console.error("Error signing in with Google:", error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
        setShowLoadingModal(false);
      }
    };
  
    const sendUserInfoToServer = async (userInfo) => {
      try {
        setShowLoadingModal(true);
    
        const response = await fetch("https://geeztoamharic.onrender.com/api/users/mobile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Response from server:", data);
          const userData = JSON.stringify({
            user_info: data.useremail,
            token: data.token,
            pic: data.pic,
          });
          signIn(userData);
          Navigation.navigate("App");
        } else {
          console.error("Error while sending data to server:", error);
        }
      } catch (error) {
        console.error("Error while sending data to server:", error);
      } finally {
        setShowLoadingModal(false); // Ensure setShowLoadingModal is called here regardless of success or failure
      }
    };
    

    const formik = useFormik({
      initialValues: { email: "", password: "" },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        console.log("values on login",values);
        try {
          setLoading(true)
          const response = await fetch(
            "https://geeztoamharic.onrender.com/api/users/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log("login user info")
            setLoading(false);
            if (data.token) {
               signIn(JSON.stringify(data))
              Navigation.navigate("App");
            } else {
              Alert.alert("Error", "login failed. Please try again.");
            }

          } else {
            try {
              const errorData = await response.json();
              Alert.alert("Error", errorData.Message || errorData.message);
            } catch (error) {
              console.error("Error parsing error response:", error);
              Alert.alert(
                "Error",
                "An error occurred while processing the response. Please try again."
              );
            }
            // setLoading(false);

          }
        } catch (error) {
          setLoading(false);
          console.error("Error registering:", error);
          Alert.alert(
            "Error",
            "An error occurred while registering. Please try again."
          );
        }
        setLoading(false);

      },
    });

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 140,
                width: 200,
              }}
              source={require("../assets/login.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 10,
              }}
              size="h3"
            >
              Login
            </Text>
            <Text style={{fontSize:15}}>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 10,fontSize:13,height:43 }}
              placeholder="Enter your email"
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              value={formik.values.email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
           
            />
            {formik.touched.email && formik.errors.email && (
              <Text style={{ color: "#9d0208",fontSize:12,fontWeight:'100' }}>{formik.errors.email}</Text>
            )}

<Text style={{fontSize:15}}>Password</Text>
<TextInput
           containerStyle={{ marginTop: 5,height:42 }}
           placeholder="Password"
           secureTextEntry={!showPasswordC}
                   borderless
                   onChangeText={formik.handleChange("password")}
                   onBlur={formik.handleBlur("password")}
                   value={formik.values.password}
                   autoCapitalize="none"
                   autoCompleteType="off"
                   autoCorrect={false}
                   
                   rightContent={
                    <TouchableOpacity onPress={togglePasswordVisibilityC}>
                    <Ionicons name={showPasswordC?"eye-off":"eye"} size={20} color={'grey'} />
                   </TouchableOpacity>
                }
                 />
                 {formik.touched.password && formik.errors.password && (
                   <Text style={{ color: "#9d0208",fontSize:12,fontWeight:'100' }}>{formik.errors.password}</Text>
                 ) }

            <Button
              text={loading ?<ActivityIndicator/>: "Continue"}
              onPress={() => {
                formik.handleSubmit()
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Account");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    color:themeColor.primary500,
                    marginLeft: 5,
                  }}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgetPassword");
                }}
              >
                <Text size="md" fontWeight="bold">
                  Forget password
                </Text>
              </TouchableOpacity> */}
            </View>
            <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  justifyContent: "center",
                }}
              >
                      <Text size="sm">Or sign up with</Text>

                  <GoogleSigninButton
                    size={GoogleSigninButton.Size.Standard}
                    color={GoogleSigninButton.Color.Dark}
                    // disabled={!request}
                    onPress={() => {
                      signWithGoogle();
                    }}
                    style={{ width: 170, height: 40 }}
                  />
      
              </View>
          </View>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showLoadingModal}
          // onRequestClose={() => {
          //   // Do nothing, or handle the modal close action
          // }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator animating={true} color="#ffffff" size="large" />
            </View>
          </View>
        </Modal>
      </Layout>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicatorWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 20,
  },
});
// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   StatusBar,
//   KeyboardAvoidingView,
//   View,
//   Alert,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { Block, Text, theme } from "galio-framework";
// import { Button, Icon, Input } from "../components";
// import { Images, argonTheme } from "../constants";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const { width, height } = Dimensions.get("screen");

// const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Invalid email')
//     .required('Email is required'),
//   password: Yup.string().required('Password is required'),
// });

// function Login() {
//   const [cloading,setCloading]=useState();
//   const Navigation = useNavigation(); // useNavigation hook from react-navigation
//   const [userDadaG,setUserDAtaG]=useState(null);
//   const [isSigningIn, setIsSigningIn] = useState(false);

//   GoogleSignin.configure({
//     androidClientId:
//         "614987848037-hhp4o0f3fn5coeu2cshu3pnltis4shqt.apps.googleusercontent.com",
//   });

//   useEffect(() => {
//     async function userD() {
//       // You can await here
//       const response = await AsyncStorage.getItem('userData');
//       if(response){
//         Navigation.replace('App');
//       }
//     }
//     userD();
//   }, []);

//   const signwithGoogle = async () => {
//     console.log("login sign click");
//     try {
//       const isSignedIn=await GoogleSignin.isSignedIn();
//       if (isSignedIn) {
//         await GoogleSignin.signOut();
//       }
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       console.log("userInfoqq", userInfo);
//       sendUserInfoToServer(userInfo)
//     } catch (error) {
//       console.error("Error signing in with Google:", error);
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
//   };

//   const sendUserInfoToServer = async (userInfo) => {
//       fetch('https://geeztoamharic.onrender.com/api/users/mobile', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userInfo),
//       })
//         .then((res) => res.json())
//         .then(async(data) => {
//   console.log('Response from server1:', data);

//   await AsyncStorage.setItem('userData', JSON.stringify({ user_info: data.useremail, token: data.token,pic:data.pic }));

//   // Use replace instead of navigate to ensure user cannot navigate back to the register screen
//   Navigation.replace("App");
// })

//         .catch((error) => {
//           console.error('Error while sending data to server:', error);
//         });
//     };

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const response = await fetch('https://geeztoamharic.onrender.com/api/users/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email: values.email, password: values.password }),
//         });
//         if (response.ok) {
//           const data = await response.json();
//           if (data.token) {
//             await AsyncStorage.setItem('userData', JSON.stringify(data));
//             Navigation.navigate("App");
//           } else {
//             Alert.alert('Error', 'Registration failed. Please try again.');
//           }
//         } else {
//           try {
//             const errorData = await response.json();
//             Alert.alert('Error', errorData.Message || errorData.message);
//           } catch (error) {
//             console.error('Error parsing error response:', error);
//             Alert.alert('Error', 'An error occurred while processing the response. Please try again.');
//           }
//         }
//       } catch (error) {
//         console.error('Error registering:', error);
//         Alert.alert('Error', 'An error occurred while registering. Please try again.');
//       }
//     },
//   });

//   return (
//     <Block flex middle>
//       <StatusBar hidden />
//       <ImageBackground
//         source={Images.RegisterBackground}
//         style={{ width, height, zIndex: 1 }}
//       >
//         <Block safe flex middle>
//           <Block style={styles.registerContainer}>
//             <Block flex>
//               <Block
//                 flex={0.17}
//                 middle
//                 style={{
//                   backgroundColor: '#1E90FF',
//                 }}
//               >
//                 <Text color={argonTheme.COLORS.WHITE} size={24} style={{fontWeight:'900',}}>
//                   Login
//                 </Text>
//               </Block>

//               <Block flex center>
//                 <ScrollView>
//                   <KeyboardAvoidingView
//                     style={{ flex: 1 }}
//                     behavior="padding"
//                     enabled
//                     keyboardVerticalOffset={10}
//                   >
//                     <Block width={width * 0.8} style={{ marginTop:60}}>
//                       <Input
//                         borderless
//                         placeholder="Email"
//                         onChangeText={formik.handleChange("email")}
//                         onBlur={formik.handleBlur("email")}
//                         value={formik.values.email}
//                         iconContent={
//                           <Icon
//                             size={16}
//                             color={argonTheme.COLORS.ICON}
//                             name="ic_mail_24px"
//                             family="ArgonExtra"
//                             style={styles.inputIcons}
//                           />
//                         }
//                       />
//                       {formik.touched.email && formik.errors.email && (
//                         <Text style={{ color: "red" }}>
//                           {formik.errors.email}
//                         </Text>
//                       )}
//                     </Block>
//                     <Block width={width * 0.8} style={{marginTop:10}}>
//                       <Input
//                         password
//                         borderless
//                         placeholder="Password"
//                         onChangeText={formik.handleChange("password")}
//                         onBlur={formik.handleBlur("password")}
//                         value={formik.values.password}
//                         iconContent={
//                           <Icon
//                             size={16}
//                             color={argonTheme.COLORS.ICON}
//                             name="padlock-unlocked"
//                             family="ArgonExtra"
//                             style={styles.inputIcons}
//                           />
//                         }
//                       />
//                       {formik.errors.password && (
//                         <Text style={{ color: "red" }}>
//                           {formik.errors.password}
//                         </Text>
//                       )}
//                     </Block>

//                     <Block middle>
//                       <Button
//                         color="primary"
//                         style={styles.createButton}
//                         // onPress={formik.handleSubmit}
//                         disabled={cloading}
//                       >
//                         {cloading ? (
//                           <ActivityIndicator color={argonTheme.COLORS.WHITE} />
//                         ) : (
//                           <Text bold size={15} color={argonTheme.COLORS.WHITE}>
//                             LOGIN
//                           </Text>
//                         )}
//                       </Button>
//                     </Block>

//                     <Block
//                       middle
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Text color="#8898AA" size={12} >
//                         if you don't an account?
//                       </Text>
//                       <TouchableOpacity
//                         onPress={() => Navigation.navigate("Account")}
//                       >
//                         <Text style={{ color: argonTheme.COLORS.ACTIVE,paddingLeft:10 }} size={15}>
//                           sign up
//                         </Text>
//                       </TouchableOpacity>
//                     </Block>

//                     <Block row style={{ marginLeft: 70, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                       <GoogleSigninButton
//                         size={GoogleSigninButton.Size.Standard}
//                         color={GoogleSigninButton.Color.Dark}
//                         // disabled={!request}
//                         onPress={() => {
//                           signwithGoogle()
//                                                 }}
//                         style={{ width: 120, height: 40 }}
//                       />
//                     </Block>

//                   </KeyboardAvoidingView>
//                 </ScrollView>
//               </Block>
//             </Block>
//           </Block>
//         </Block>
//       </ImageBackground>
//     </Block>
//   );
// }

// const styles = StyleSheet.create({
//   registerContainer: {
//     width: width * 0.9,
//     height: height * 0.875,
//     backgroundColor: "#F4F5F7",
//     borderRadius: 4,
//     shadowColor: argonTheme.COLORS.BLACK,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 1,
//     overflow: "hidden",
//   },
//   inputIcons: {
//     marginRight: 12,
//   },
//   createButton: {
//     width: width * 0.78,
//     marginTop: 25,
//   },
// });

// export default Login;
