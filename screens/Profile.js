import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Block, theme } from "galio-framework";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";
import { Button, TextInput, Text, themeColor } from "react-native-rapi-ui";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Ionicons, AntDesign } from "@expo/vector-icons";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const validationSchema = Yup.object().shape({
  password: Yup.string().required("password is required"),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function Profile() {
  const { user, signOut } = useContext(AuthContext);
  const [userinfo, setUser] = useState(null);
  const navigation = useNavigation();
  //logout functionalty
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordC, setShowPasswordC] = useState(false);
  const [shownewPassword, setNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [changePaaword, setChangePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const togglePasswordVisibilityC = () => {
    setShowPasswordC((prevShowPassword) => !prevShowPassword);
  };
  const togglePasswordVisibilityNewPassword = () => {
    setNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleChangePaaword = () => {
    setChangePassword((prevShowPassword) => !prevShowPassword);
  };

  const checkUserInfo = async () => {
    try {
      if (user) {
        const userInfo = JSON.parse(user);
        setUser(userInfo); // Accessing 'user' object from the retrieved data
      } else {
        // signOut();
        navigation.navigate("Onboarding");
      }
    } catch (error) {
      console.error("Error checking user login:", error);
    }
  };

  useEffect(() => {
    checkUserInfo();
  }, [user]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Values", values);
      console.log("id", userinfo.user_info.user_id);
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://geeztoamharic.onrender.com/api/users/passwordchange",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userinfo.token}`,
            },
            body: JSON.stringify({
              id: userinfo.user_info.user_id,
              oldpassword: values.password,
              newpassword: values.newPassword,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          if (data.success === true) {
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
            setChangePassword(false);
            formik.resetForm();
          } else {
            Alert.alert("Error", "Password change failed. Please try again.");
          }
        } else {
          const errorData = await response.json();
          console.log("error messa", errorData);
          Alert.alert("Error", errorData.message);
        }
      } catch (error) {
        console.error("Error changing password:", error);
        Alert.alert(
          "Error",
          "An error occurred while changing the password. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteAccount=async ()=>{
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://geeztoamharic.onrender.com/api/users/delete/${userinfo.user_info.user_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userinfo.token}`,
          },
         
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        if (data.success === 'success') {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          signOut();
          navigation.navigate('onboarding')
          // navigation.navigate('logout');

        } else {
          Alert.alert("Error", "something want wrong. Please try again.");
        }
      } else {
        const errorData = await response.json();
        console.log("error messa", errorData);
        Alert.alert("Error", errorData.message);
      }
    } catch (error) {
      console.error("Error DE:", error);
      Alert.alert(
        "Error",
        "something want wrong please try again!"
      );
    } finally {
      // setIsLoading(false);
    }
    setModalVisible(false);
  }

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={
                    userinfo?.pic
                      ? { uri: userinfo?.pic }
                      : require("../assets/profile_12901975.png")
                  }
                  style={styles.avatar}
                />
              </Block>
              <Block style={styles.info}>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 20, paddingBottom: 24 }}
                ></Block>
                <Block row space="between">
                  <Block middle>
                    <Text
                      bold
                      size={"h3"}
                      color="#525F7F"
                      style={{ marginBottom: 4 }}
                    >
                      Email
                    </Text>
                    <Text size={12} color={argonTheme.COLORS.TEXT}>
                      {userinfo?.user_info?.email}
                    </Text>
                  </Block>
                </Block>
              </Block>
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text
                    size={"h3"}
                    style={{ fontWeight: "bold", color: "#32325D" }}
                  >
                    {userinfo?.user_info?.full_name}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    Addis Abab, Ethiopia
                  </Text>
                </Block>
                <Block style={{ marginTop: 20 }}>
                  <Button
                    text="Your Favorite Text"
                    status="warning"
                    outline
                    style={{ marginBottom: 20 }}
                    onPress={() => {
                      navigation.navigate("Favorite");
                    }}
                  />
                  <Button
                    text="Translate Now"
                    status="primary"
                    outline
                    onPress={() => {
                      navigation.navigate("Home");
                    }}
                  />
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                {changePaaword ? (
                  <>
                    <Block column space="between">
                      <Text
                        size={"h3"}
                        style={{ marginBottom: 20 }}
                        onPress={toggleChangePaaword}
                      >
                        Change password{" "}
                        <AntDesign name="down" size={24} color="black" />
                      </Text>

                      <Text style={{ marginTop: 5, fontSize: 13 }}>
                        Password
                      </Text>
                      <TextInput
                        containerStyle={{ marginTop: 5, height: 42 }}
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
                            <Ionicons
                              name={showPassword ? "eye-off" : "eye"}
                              size={20}
                              color={"grey"}
                            />
                          </TouchableOpacity>
                        }
                      />
                      {formik.touched.password && formik.errors.password && (
                        <Text
                          style={{
                            color: "#9d0208",
                            fontSize: 12,
                            fontWeight: "100",
                          }}
                        >
                          {formik.errors.password}
                        </Text>
                      )}
                      <Text style={{ marginTop: 5, fontSize: 13 }}>
                        New Password
                      </Text>
                      <TextInput
                        containerStyle={{ marginTop: 5, height: 42 }}
                        placeholder="new password here"
                        secureTextEntry={!shownewPassword}
                        borderless
                        onChangeText={formik.handleChange("newPassword")}
                        onBlur={formik.handleBlur("newPassword")}
                        value={formik.values.newPassword}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                        rightContent={
                          <TouchableOpacity
                            onPress={togglePasswordVisibilityNewPassword}
                          >
                            <Ionicons
                              name={shownewPassword ? "eye-off" : "eye"}
                              size={20}
                              color={"grey"}
                            />
                          </TouchableOpacity>
                        }
                      />
                      {formik.touched.newPassword &&
                        formik.errors.newPassword && (
                          <Text
                            style={{
                              color: "#9d0208",
                              fontSize: 12,
                              fontWeight: "100",
                            }}
                          >
                            {formik.errors.newPassword}
                          </Text>
                        )}

                      <Text style={{ marginTop: 5, fontSize: 13 }}>
                        Re-Password
                      </Text>
                      <TextInput
                        containerStyle={{ marginTop: 5, height: 42 }}
                        placeholder="Re-enter new password"
                        secureTextEntry={!showPasswordC}
                        rightContent={
                          <TouchableOpacity onPress={togglePasswordVisibilityC}>
                            <Ionicons
                              name={showPasswordC ? "eye-off" : "eye"}
                              size={20}
                              color={"grey"}
                            />
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
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <Text
                            style={{
                              color: "#9d0208",
                              fontSize: 12,
                              fontWeight: "100",
                            }}
                          >
                            {formik.errors.confirmPassword}
                          </Text>
                        )}
                      <Block style={{ marginVertical: 20 }}>
                        <Button
                          text={isLoading ? <ActivityIndicator /> : "Change"}
                          onPress={formik.handleSubmit}
                          disabled={isLoading}
                        />
                      </Block>
                    </Block>
                  </>
                ) : (
                  <Block style={{ justifyContent: "center" }}>
                    {userinfo?.user_info?.password ? (
                      <Button
                        text="Change password"
                        status="primary"
                        onPress={toggleChangePaaword}
                      />
                    ) : (
                      ""
                    )}

                    {/* <Button text="Logout" status="danger"/>  */}
                  </Block>
                )}
              </Block>
              <Block style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 50 }}>
    <Text size="h4" style={{ marginRight: 10, marginTop: 12, fontWeight: "bold", color: "#32325D" }}> Delete Account</Text>  
    <Button width={80} text={<AntDesign name="delete" size={20} color="red" />} status="danger" outline type={TouchableOpacity} onPress={()=>setModalVisible(true)} />
</Block>

            </Block>
            
          </ScrollView>
        </ImageBackground>

        
      </Block>
      {modalVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account?
              </Text>
              <View style={styles.buttonContainer}>
                <Button text="Cancel" onPress={() => setModalVisible(false)}/>
      
                <Button
                  text="DELETE"
                  small
                  style={{ backgroundColor: argonTheme.COLORS.ERROR }}
                  status="danger" 
                                
                        onPress={handleDeleteAccount}        
                                />
                 
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        ""
      )}
      
    </Block>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },

  modalContent: {
    width: width * 0.95, // Adjust the width as needed
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20, // Adjust as needed
  },
  button: {
    marginHorizontal: 10,
    maxWidth: 120,
  },
  backgroundColor: argonTheme.COLORS.PRIMARY,
});

export default Profile;
