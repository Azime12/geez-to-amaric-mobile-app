  import React, { useContext, useState } from "react";
  import {
    ScrollView,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Image,
    Dimensions,
    Alert,
    Modal,
    StyleSheet,
    ActivityIndicator
  } from "react-native";
  // import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
  import { useEffect } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation } from "@react-navigation/native";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { Ionicons } from '@expo/vector-icons';
  import { AuthContext } from "../components/AuthContext";
import { ToastAndroid } from "react-native";

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Name must contain only alphabetic characters and spaces"
      )
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long"
      )
      .required("Password is required"),
      confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')});

  export default function ({ navigation }) {
    const { user,signIn } = useContext(AuthContext);
    const { isDarkmode, setTheme } = useTheme();  // const auth = getAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordC, setShowPasswordC] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [loading, setLoading] = useState(false);
      const Navigation = useNavigation();
    
    
      useEffect(() => {
      
        if(user){
          Navigation.navigate('App');
        }
    
    },[user])
    
    
    
      const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
      };
      const togglePasswordVisibilityC = () => {
        setShowPasswordC((prevShowPassword) => !prevShowPassword);
      };
    
      //google signin
     
      
      

    
      const signInWithGoogle = async () => {
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
        
        console.log("Registration sign click");
        try {
          const isSignedIn=await GoogleSignin.isSignedIn();
          if (isSignedIn) {
            await GoogleSignin.signOut();
          }
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log("userInfoqq", userInfo);
          sendUserInfoToServer(userInfo)
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
        }

      };
      

      const sendUserInfoToServer = async (userInfo) => {
        setShowLoadingModal(true);
          fetch('https://geeztoamharic.onrender.com/api/users/mobile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
          })
            .then((res) => res.json())
            .then(async(data) => {
              console.log('Response from server1:', data);
            
              const userData=JSON.stringify({ user_info: data.useremail, token: data.token,pic:data.pic });
            signIn(userData);          
              // Use replace instead of navigate to ensure user cannot navigate back to the register screen
              Navigation.replace("App");
              setShowLoadingModal(false);

            })
            
            .catch((error) => {
              console.error('Error while sending data to server:', error);
              setShowLoadingModal(false);

            }
          
          );
            setShowLoadingModal(false);
        };
        

      const formik = useFormik({
        initialValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword:"",
        },
        validationSchema: validationSchema,
        
        onSubmit: async (values) => {
          console.log("values reg",values)
          try {
            setLoading(true);
            const response = await fetch("https://geeztoamharic.onrender.com/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                full_name: values.name,
                email: values.email,
                password: values.password,
              }),
            });
          
            console.log("Response status:", response.status); // Log response status
          
            if (response.ok) {
              const data = await response.json();
              console.log("Registration response:", data);
              if (data.success === "True") {
                console.log("Access token:", data.token);
                console.log("User info:", data.userinfo);
              const userData=JSON.stringify({ user_info: data.userinfo, token: data.token });
              signIn(userData);
              setLoading(false);
                Navigation.navigate('App');
                ToastAndroid.show("Succefully registed", ToastAndroid.SHORT);

              } else {
                setLoading(false);
                Alert.alert("Error", "Registration failed. Please try again.");
              }
            } else {
              setLoading(false);
              // If response status is not OK, handle the error
           try {
            setLoading(false);
                const errorData = await response.json();
                console.log("Error response:", errorData); // Log error response
                Alert.alert("Error", errorData.message);
              } catch (error) {
                setLoading(false);
                console.error("Error parsing error response:", error);
                Alert.alert(
                  "Error",
                  "An error occurred while processing the response. Please try again."
                );
              }
            }
          } catch (error) {
            setLoading(false);

            // Handle network errors or other exceptions
            console.error("Error registering:", error);
            // setCloading(false);
            Alert.alert(
              "Error",
              "An error occurred while registering. Please try again."
            );
          }
          
          setLoading(false);
    
        },
      });
    
    async function register() {
      setLoading(true);
      // await createUserWithEmailAndPassword(auth, email, password).catch(function (
      //   error
      // ) {
      //   // Handle Errors here.
      //   var errorCode = error.code;
      //   var errorMessage = error.message;
      //   // ...
      //   setLoading(false);
      //   alert(errorMessage);
      // });
    }

    return (
      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
        <Layout>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>

              <Image
                resizeMode="contain"
                style={{
                  height: 80,
                  width: 200,
                }}
                source={require("../assets/register.png")}
              />
            </View>
            <View
              style={{
                flex: 3,
                paddingHorizontal: 20,
                paddingBottom: 5,
                backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
              }}
            >
              <Text
                fontWeight="bold"
                size="h3"
                style={{
                  alignSelf: "center",
                  // padding: 5,
                }}
              >
                Register
              </Text>
              <Text style={{ marginTop: 5,fontSize:13 }}>Full name</Text>
              <TextInput
                containerStyle={{ marginTop: 5,height:40 }}
                placeholder="Enter your name..."
                borderless
              //   rightContent={
              //     <Ionicons name="mail" size={20} color={'grey'} />
              // }
                        onChangeText={formik.handleChange("name")}
                        onBlur={formik.handleBlur("name")}
                        value={formik.values.name}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <Text style={{ color: "#9d0208",fontSize:12,fontWeight:'100' }}>{formik.errors.name}</Text>
                      ) }
              <Text style={{ marginTop: 5,fontSize:13 }}>Email</Text>
              <TextInput
                containerStyle={{ marginTop: 5,height:40 }}
                placeholder="Enter email..."
                borderless
                        onChangeText={formik.handleChange("email")}
                        onBlur={formik.handleBlur("email")}
                        value={formik.values.email}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <Text style={{ color: "#9d0208",fontSize:12,fontWeight:'100' }}>{formik.errors.email}</Text>
                      ) }
              <Text style={{ marginTop: 5,fontSize:13 }}>Password</Text>
              <TextInput
            containerStyle={{ marginTop: 5,height:42 }}
            placeholder="Password"
            secureTextEntry={!showPassword}
            borderless
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    value={formik.values.password}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    
                    rightContent={
                      <TouchableOpacity onPress={togglePasswordVisibility}>
                      <Ionicons name={showPassword?"eye-off":"eye"} size={20} color={'grey'} />

                    </TouchableOpacity>
                  }
                  />
                  {formik.touched.password && formik.errors.password && (
                    <Text style={{ color: "#9d0208",fontSize:12,fontWeight:'100' }}>{formik.errors.password}</Text>
                  ) }

              <Text style={{ marginTop: 5,fontSize:13 }}>Re-Password</Text>
              <TextInput
              containerStyle={{ marginTop: 5,height:42}}
              placeholder="Re-enter password"
              secureTextEntry={!showPasswordC}
              rightContent={
                <TouchableOpacity onPress={togglePasswordVisibilityC}>
                <Ionicons name={showPasswordC?"eye-off":"eye"} size={20} color={'grey'} />

                </TouchableOpacity>
            }
              borderless
                      onChangeText={formik.handleChange("confirmPassword")}
                      onBlur={formik.handleBlur("confirmPassword")}
                      value={formik.values.confirmPassword}
                      autoCapitalize="none"
                      autoCompleteType="off"
                      autoCorrect={false}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <Text style={{ color: "#9d0208",fontSize:12,fontWeight:'100' }}>{formik.errors.confirmPassword}</Text>
                    ) }
              <Button
                text={loading ? <ActivityIndicator animating={true} color="#ffffff" size="large" />: "Create an account"}
                
                onPress={() => {
                  formik.handleSubmit()              }}
                style={{
                  marginTop: 10,
                  height: 45,
                  alignItems: 'center', // Align button text to center
                  justifyContent: 'center', // Align button text to center
                  // marginBottom: 20, // Increase bottom margin to prevent text from being hidden
                  padding: 10, // Add horizontal padding to provide space for the text
                  textAlign: 'center', // Align button text to cente
                }}
                // disabled={loading}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,

                  justifyContent: "center",
                }}
              >
                <Text size="md">Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    Navigation.navigate("Login");
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
                    Login here
                  </Text>
                </TouchableOpacity>
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
                      signInWithGoogle();
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
            onRequestClose={() => {
              // Do nothing, or handle the modal close action
            }}
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










// import React from "react";
// import {
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   StatusBar,
//   KeyboardAvoidingView,
//   View,
//   ToastAndroid,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Block, Checkbox, Text, Toast, theme } from "galio-framework";
// import { Button, Icon, Input } from "../components";
// import { Images, argonTheme } from "../constants";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

// const { width, height } = Dimensions.get("screen");

// const validationSchema = Yup.object().shape({
//   name: Yup.string()
//     .matches(
//       /^[A-Za-z\s]+$/,
//       "Name must contain only alphabetic characters and spaces"
//     )
//     .min(2, "Name must be at least 2 characters")
//     .required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string()
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
//       "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long"
//     )
//     .required("Password is required"),
//     confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match')
//     .required('Confirm Password is required')});

// function Register() {
//   const [error, setError] = useState();
//   const [userInfo, setUserInfo] = useState();
//   const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
//   const [cloading, setCloading] = useState();
//   const Navigation = useNavigation();

 
// useEffect(() => {
//   async function userD() {
//     // You can await here
//     const response = await AsyncStorage.getItem('userData');
//     if(response){
//       Navigation.navigate('App');
//     }
//   }
//   userD();
// }, []); 

//   const configureGoogleSignIn = () => {
//     GoogleSignin.configure({
//       androidClientId:
//         "614987848037-hhp4o0f3fn5coeu2cshu3pnltis4shqt.apps.googleusercontent.com",
//     });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   useEffect(() => {
//     configureGoogleSignIn();
//   });

 
//   GoogleSignin.configure({
//     androidClientId:
//         "614987848037-hhp4o0f3fn5coeu2cshu3pnltis4shqt.apps.googleusercontent.com",
//   });

//   const signIn = async () => {
//     console.log("Registration sign click");
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
//           console.log('Response from server1:', data);
        
//           await AsyncStorage.setItem('userData', JSON.stringify({ user_info: data.useremail, token: data.token,pic:data.pic }));
        
//           // Use replace instead of navigate to ensure user cannot navigate back to the register screen
//           Navigation.replace("App");
//         })
        
//         .catch((error) => {
//           console.error('Error while sending data to server:', error);
//         });
//     };
    
//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword:"",
//       photo:
//         "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fprofile-placeholder&psig=AOvVaw23YqPHrcuIeFyFpVSR_qhA&ust=1713120757860000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNid9aTuv4UDFQAAAAAdAAAAABAE",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       console.log("values reg",values)
//       try {
//         setCloading(true);
//         const response = await fetch("https://geeztoamharic.onrender.com/api/users", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             full_name: values.name,
//             email: values.email,
//             password: values.password,
//           }),
//         });
      
//         console.log("Response status:", response.status); // Log response status
      
//         if (response.ok) {
//           const data = await response.json();
//           console.log("Registration response:", data);
//           if (data.success === "True") {
//             console.log("Access token:", data.accessToken);
//             console.log("User info:", data.userinfo);
//               await AsyncStorage.setItem('userData', JSON.stringify({ user_info: data.userinfo, token: data.accessToken }));
//             Navigation.navigate('App');

//           } else {
//             setCloading(false);
//             // If response is successful but does not contain success and token, handle the error
//             Alert.alert("Error", "Registration failed. Please try again.");
//           }
//         } else {
//           setCloading(false);
//           // If response status is not OK, handle the error
//           try {
//             const errorData = await response.json();
//             console.log("Error response:", errorData); // Log error response
//             Alert.alert("Error", errorData.message);
//           } catch (error) {
//             console.error("Error parsing error response:", error);
//             Alert.alert(
//               "Error",
//               "An error occurred while processing the response. Please try again."
//             );
//           }
//         }
//       } catch (error) {
//         // Handle network errors or other exceptions
//         console.error("Error registering:", error);
//         setCloading(false);
//         Alert.alert(
//           "Error",
//           "An error occurred while registering. Please try again."
//         );
//       }
      
//       setCloading(false);

//     },
//   });

//   return (
    
      
//      <Block flex middle>
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
//                 // height={50}
//                 style={{
//                   // height:30,
//                   // marginTop:23,
//                   backgroundColor: '#1E90FF',
//                   // paddingTop: 20,
//                 }}
//               >
//                 <Text color={argonTheme.COLORS.WHITE} size={24} style={{fontWeight:'900',}}>
//                   Sign up
//                 </Text>
//               </Block>

//               <Block flex center>
//               <ScrollView >
//               <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior="padding" // Change behavior to "padding"
//         enabled
//         keyboardVerticalOffset={10} // Adjust offset as needed
//       >
//                   <Block width={width * 0.8} style={{ marginTop: 50, }}>
//                     <Input
//                       borderless
//                       placeholder="Name"
//                       onChangeText={formik.handleChange("name")}
//                       onBlur={formik.handleBlur("name")}
//                       value={formik.values.name}
//                       iconContent={
//                         <Icon
//                           size={16}
//                           color={argonTheme.COLORS.ICON}
//                           name="hat-3"
//                           family="ArgonExtra"
//                           style={styles.inputIcons}
//                         />
//                       }
//                     />
//                     {formik.touched.name && formik.errors.name && (
//                       <Text style={{ color: "red" }}>{formik.errors.name}</Text>
//                     )}
//                   </Block>
//                   <Block width={width * 0.8} style={{ marginTop: 0 }}>
//                     <Input
//                       borderless
//                       placeholder="Email"
//                       onChangeText={formik.handleChange("email")}
//                       onBlur={formik.handleBlur("email")}
//                       value={formik.values.email}
//                       iconContent={
//                         <Icon
//                           size={16}
//                           color={argonTheme.COLORS.ICON}
//                           name="ic_mail_24px"
//                           family="ArgonExtra"
//                           style={styles.inputIcons}
//                         />
//                       }
//                     />
//                     {formik.touched.email && formik.errors.email && (
//                       <Text style={{ color: "red" }}>
//                         {formik.errors.email}
//                       </Text>
//                     )}
//                   </Block>
//                   <Block width={width * 0.8}>
//                     <Input
//                       password
//                       borderless
//                       placeholder="Password"
//                       onChangeText={formik.handleChange("password")}
//                       onBlur={formik.handleBlur("password")}
//                       value={formik.values.password}
//                       iconContent={
//                         <Icon
//                           size={16}
//                           color={argonTheme.COLORS.ICON}
//                           name="padlock-unlocked"
//                           family="ArgonExtra"
//                           style={styles.inputIcons}
//                         />
//                       }
//                     />
//                     {formik.errors.password && (
//                       <Text style={{ color: "red" }}>
//                         {formik.errors.password}
//                       </Text>
//                     )}
                  
//                   </Block>
//                   <Block width={width * 0.8}>
//                     <Input
//                       password
//                       borderless
//                       placeholder="Re-Enter password"
//                       onChangeText={formik.handleChange("confirmPassword")}
//                       onBlur={formik.handleBlur("confirmPassword")}
//                       value={formik.values.confirmPassword}
//                       iconContent={
//                         <Icon
//                           size={16}
//                           color={argonTheme.COLORS.ICON}
//                           name="padlock-unlocked"
//                           family="ArgonExtra"
//                           style={styles.inputIcons}
//                         />
//                       }
//                     />
//                     {formik.errors.confirmPassword && (
//                       <Text style={{ color: "red" }}>
//                         {formik.errors.confirmPassword}
//                       </Text>
//                     )}
                
//                   </Block>
//                                 <Block middle>
//                     <Button
//                       color="primary"
//                       style={styles.createButton}
                      // onPress={formik.handleSubmit}
//                       disabled={cloading} // Disable the button when loading is true
//                     >
//                       {cloading ? ( // Render loading indicator if loading is true
//                         <ActivityIndicator color={argonTheme.COLORS.WHITE} />
//                       ) : (
//                         <Text bold size={14} color={argonTheme.COLORS.WHITE}>
//                           CREATE ACCOUNT
//                         </Text>
//                       )}
//                     </Button>
//                   </Block>
//                   <Block
//                     middle
//                     style={{
//                       display: "flex",
//                       flexDirection: "row",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Text color="#8898AA" size={12}>
//                     Do you have an account?   
//                     </Text>
//                     <TouchableOpacity
//                       // style={{
//                       //   backgroundColor: "transparent",
//                       //   color: argonTheme.COLORS.BLACK,
//                       // }}
//                       onPress={() => Navigation.navigate("Login")}
//                     >

//                       <Text style={{ color: argonTheme.COLORS.ACTIVE,paddingLeft:10 }} size={15}>
//                         Login
//                       </Text>
//                     </TouchableOpacity>
//                   </Block>

//                   <Block row>
                    
//                     <View style={styles.container}>
//                       {/* <Text>{JSON.stringify(error)}</Text> */}
//                       {/* {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>} */}
//                       {/* {userInfo ? (
//                         <Button title="Logout" onPress={logout} />
//                       ) : ( */}
//                       <Block middle style={{ alignItems: "center",marginTop:10,marginLeft:40 }} >
//                         {/* <Text color="#8898AA" size={12}>
//                           Or sign up with
//                         </Text> */}
//                         <GoogleSigninButton
//                           size={GoogleSigninButton.Size.Standard}
//                           color={GoogleSigninButton.Color.Dark}
//                           onPress={signIn}
//                           style={{ width: 120, height: 40 }} // Adjust the width as needed
//                         />
//                       </Block>
//                       {/* )} */}
//                       <StatusBar style="auto" />
//                     </View>
//                   </Block>
//                 </KeyboardAvoidingView>
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
//     width: width * 0.95,
//     height: height * 0.9,
//     backgroundColor: "#fff",
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
//   socialConnect: {
//     backgroundColor: argonTheme.COLORS.WHITE,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: "#8898AA",
//   },
//   socialButtons: {
//     width: 120,
//     height: 40,
//     backgroundColor: "#fff",
//     shadowColor: argonTheme.COLORS.BLACK,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 1,
//   },
//   socialTextButtons: {
//     color: argonTheme.COLORS.PRIMARY,
//     fontWeight: "800",
//     fontSize: 14,
//   },
//   inputIcons: {
//     marginRight: 12,
//   },
//   passwordCheck: {
//     paddingLeft: 15,
//     paddingTop: 13,
//     paddingBottom: 30,
//   },
//   createButton: {
//     width: width * 0.8,
//     height: 40,
//     marginTop: 25,
//   },
// });

// export default Register;
