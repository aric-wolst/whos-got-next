import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default class FindTeamsHeader extends Component {
    render() {
        return(
            <View style = {styles.FindTeamsHeaderBackground}>
                <Text style = {styles.FindTeams}>Find Teams</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    FindTeamsHeaderBackground: {
        backgroundColor: '#ff8c00',
        alignItems: 'center'
    },
    FindTeams: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
});