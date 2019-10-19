import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, StatusBar, StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import Teams from './screens/Teams';
import * as Facebook from 'expo-facebook';


class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
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
    title: 'Sign In',
  };

  logIn = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('407364903529255', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        await AsyncStorage.setItem('userToken', token);
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const json = await response.json();
        console.log(json);
        console.log('here2');
        Alert.alert('Logged in!', `Hi ${json.name}!`);
        this.props.navigation.navigate('App');
      } else {
        // type === 'cancel'
        Alert.alert('Did not work', `Sorry`);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to Who's Got Next!</Text>
        <TouchableOpacity onPress = {() => this.logIn()}>
          <View style = {{width: '50%', borderRadius: 4, padding: 24, backgroundColor: '#3b5998'}}>
            <Text style = {{color: 'white'}}>Login with Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const AppTabs = createBottomTabNavigator(
  {
  Profile: Profile,
  Teams: Teams,
  Settings: Settings,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const {routeName} = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if(routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Profile') {
          iconName = `ios-contact`;
        } else if (routeName == 'Teams') {
          iconName = `ios-people`;
        } else if (routeName == 'Settings') {
          iconName = 'ios-settings';
        }

        return <IconComponent name = {iconName} size = {25} color = {tintColor}/>
      },
    }),
    tabBarOptions: {
      activeTintColor : '#ff8c00',
      inactiveTintColor: 'gray',
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
      initialRouteName: 'AuthLoading',
    }
  )
);




