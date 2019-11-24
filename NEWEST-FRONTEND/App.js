import React, { Component } from "react";
import { AsyncStorage, ActivityIndicator, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import MyProfile from "./screens/MyProfile";
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
import logo from "./assets/img/logo.png";

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

class AuthLoadingScreen extends Component {
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
    );
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

        backendRequest("/users/exists", {type: "facebookId", identifier: json.id}, "GET").then( (user) => {
            if (user) {
              AsyncStorage.setItem(config.userIdKey, user._id).then(() => {
                Alert.alert("Logged in!", `Hi ${user.firstName}!`);
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
              }).then( (user) => {
                AsyncStorage.setItem(config.userIdKey, user._id).then(() => {
                  Alert.alert("Logged in!", `Hi ${user.firstName}!`);
                  this.presentApp();
                });
              });
            }
          }
        );
      } else {
        // type === "cancel"
        Alert.alert("Did not work", "Sorry");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  presentApp() {
      this.props.navigation.navigate("App");
      AsyncStorage.getItem(config.userIdKey).then( (userId) => {
        registerForPushNotificationsAsync(userId);
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
  TeamProfile,
  CreateEvent,
}, { headerLayoutPreset: "center" });

const AppTabs = createBottomTabNavigator(
  {
      MyProfile,
      Events: TeamsStack,
      Settings,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({ tintColor }) => {
        const {routeName} = navigation.state;
        let IconComponent = Ionicons;
        const icons = {
          "Home": "ios-information-circle${focused ? '' : '-outline'}",
          "MyProfile": "ios-contact",
          "Events": "ios-people",
          "Settings": "ios-settings"
        };
        const iconName = icons[routeName.toString()];
        
        return <IconComponent name = {iconName} size = {25} color = {tintColor}/>;
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
});


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
