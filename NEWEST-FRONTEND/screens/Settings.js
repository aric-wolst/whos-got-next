import React, { Component } from 'react';
import { AsyncStorage, Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileBio from '../components/ProfileBio';
import Legend from '../components/Legend';
import Data from '../components/Data';
import Constants from 'expo-constants';


class Settings extends React.Component {

    signOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    render() {
        return (
            <View style = { {flex: 1, justifyContent: 'center', alignItems: 'center',} }>
                <Button title = "Sign Out" onPress = {this.signOut}/>
            </View>
        );
    }
}

export default Settings;