import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text, ActivityIndicator, TouchableOpacity, ListView } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

class TeamProfile extends Component {
    render(){
        const { navigation } = this.props;
        return(
            <View>
                <Text>
                    Team Name: {navigation.getParam('teamName', 'No Team Name')}
                </Text>
                <Text>
                    Bio: {navigation.getParam('teamBio', ' ')}
                </Text>
                <Text>
                    Sport: {navigation.getParam('sport', 'No Sport Specified')}
                </Text>
                <Text>
                    Location: {navigation.getParam('location', 'No Location Specified')}
                </Text>
                <Text>
                    League: {navigation.getParam('league', 'No League Specified')}
                </Text>
                <Text>
                    Skill Level: {navigation.getParam('level', 'Any Skill Level')}
                </Text>
                <Text>
                    Number of Players Needed: {navigation.getParam('numPlayersNeeded', 'No Players Needed')}
                </Text>
            </View>
        )
    }
}

export default TeamProfile;
