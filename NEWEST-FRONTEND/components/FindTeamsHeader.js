import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default class FindTeamsHeader extends Component {
    render() {
        return(
            <View style = {styles.FindTeamsHeaderBackground}>
                <Text style = {styles.FindTeams}>Find Live Events</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    FindTeamsHeaderBackground: {
        backgroundColor: 'white',
        alignItems: 'center'
    },
    FindTeams: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ff8c00',
    },
});