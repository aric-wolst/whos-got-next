import React, { Component } from "react";
import { AsyncStorage, ActivityIndicator, StatusBar, StyleSheet, Text, View, Button, TouchableOpacity, Alert, Image } from "react-native";
import MyProfile from "./screens/MyProfile";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import Teams from "./screens/Teams";
import * as Facebook from "expo-facebook";
import TeamProfile from "./screens/TeamProfile";
import registerForPushNotificationsAsync from "./utils/PushNotificationsManager";
import config from "./config";
import backendRequest from "./utils/RequestManager";
import CreateEvent from "./screens/CreateEvent";
import logo from "./img/logo.png"

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userId = await AsyncStorage.getItem(config.userIdKey);
    this.props.navigation.navigate(userId ? "App" : "Auth");
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle = "default"/>
      </View>
    )
  }
}

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Sign In",
  };

  logIn = async () => {
    try {
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync("407364903529255", {
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        await AsyncStorage.setItem("userToken", token);
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,birthday`);
        const json = await response.json();
        console.log(json);

        backendRequest("/users/exists", {type: "facebookId", identifier: json.id}, "GET").then(user => {
            if (user) {
              console.log("user: " + JSON.stringify(user));
              AsyncStorage.setItem(config.userIdKey, user._id).then(() => {
                Alert.alert("Logged in!", `Hi ${json.name}!`);
                this.presentApp();
              });
            } else {
              backendRequest("/users",{},"POST",{
                "authentication":
                  {
                    "type": "facebookId",
                    "identifier": json.id,
                    "token": token
                  },
                "firstName": json.name,
                "lastName": json.name,
                "birthday": json.birthday,
                "description": "Go to Settings to change your bio.",
                "sports": []
              }).then( user => {
                AsyncStorage.setItem(config.userIdKey, user._id).then(() => {
                  Alert.alert("Logged in!", `Hi ${json.name}!`);
                  this.presentApp();
                });
              })
            }
          }
        )
      } else {
        // type === "cancel"
        Alert.alert("Did not work", `Sorry`);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  presentApp() {
      this.props.navigation.navigate("App");
      AsyncStorage.getItem(config.userIdKey).then(userId => {
        registerForPushNotificationsAsync(userId)
      });
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style = {styles.whosgotnext}>Who&apos;s Got Next?</Text>

        <Image style = {styles.logo} source={logo} />

        <TouchableOpacity onPress = {() => this.logIn()}>
          <View style = {{width: "70%", borderRadius: 10, padding: 24, backgroundColor: "#ff8c00", borderColor: "#ff8c00", borderWidth: 5}}>
            <Text style = {{color: "black", fontWeight: "bold", fontSize: 20}}>Login with Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const TeamsStack = createStackNavigator({
  FindTeams: Teams,
  TeamProfile: TeamProfile,
  CreateEvent: CreateEvent,
}, { headerLayoutPreset: "center" });

const AppTabs = createBottomTabNavigator(
  {
  MyProfile: MyProfile,
  Events: TeamsStack,
  Settings: Settings,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const {routeName} = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if(routeName === "Home") {
          iconName = `ios-information-circle${focused ? "" : "-outline"}`;
        } else if (routeName === "MyProfile") {
          iconName = `ios-contact`;
        } else if (routeName == "Events") {
          iconName = `ios-people`;
        } else if (routeName == "Settings") {
          iconName = "ios-settings";
        } else {
          iconName = "ios-settings";
        }

        return <IconComponent name = {iconName} size = {25} color = {tintColor}/>
      },
    }),
    tabBarOptions: {
      activeTintColor : "#ff8c00",
      inactiveTintColor: "gray",
    },
  }
);

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
})


export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppTabs,
      Auth: AuthStack,
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);

const styles = StyleSheet.create({
  logo: {
    width: 375,
    height: 150,
    resizeMode: "stretch",
    marginBottom: 100,
  },
   whosgotnext: {
    fontWeight: "bold",
    fontSize: 45,
    color: "black",
  },
});
