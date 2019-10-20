import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, StatusBar, StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import MyProfile from './screens/MyProfile';
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
    const userToken = await AsyncStorage.getItem('myId');

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

  request = async (url,method,body) => {
    return new Promise((resolve,reject) => {
      if (method === 'GET') {
        console.log('GOT1');
        fetch(url)
        .then(response => {
          console.log('START');
          console.log(response);
          // if (response != null) {
          // }
          console.log(response.headers.get("content-length"));
          if(response.headers.get("content-length") == 0) {
            return 0;
          }
          var responseJson = response.json();
          console.log(responseJson);
          console.log('END');
          return responseJson;
        })
        .then(data => {
          console.log('GOT2');
          resolve(data)
        })
        .catch(err => {
          console.log('GOT3');
          reject(err)
        });
      } else {
        fetch(url, {
          method: method,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      }
    });
  }

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
        //await AsyncStorage.setItem('myId', '5da6fec2307334139262c2bd');
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,birthday`);
        const json = await response.json();
        console.log(json);
        this.request('http://34.220.132.159/users/exists?type=facebookId&identifier=' + encodeURIComponent(json.id),'GET')
        .then((user) => {
          console.log('GOT HERE');
          console.log(user);
          if (user) {
            console.log('inside IF');
            AsyncStorage.setItem('myId', user._id);
          } else {
            console.log('inside ELSE');
            fetch('http://34.220.132.159/users/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(
                {
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
                }
              ),
            }).then( (newUserResponse) => {
              console.log('AFTER POST REQUEST');
              const newUser = newUserResponse.json();
              console.log(newUser);
              console.log('GOT HERE');
              AsyncStorage.setItem('myId', newUser._id);
            })
          }
        })
        //console.log(token);
        //console.log(json);
        //console.log('here2');
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
  MyProfile: MyProfile,
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
        } else if (routeName === 'MyProfile') {
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




