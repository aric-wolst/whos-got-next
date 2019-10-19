import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image } from 'react-native';

export default class ProfileBio extends Component {
    render() {
        return(
            <View style = {styles.header}>
                <Text style = {styles.textHeader}>BIO</Text>
                <Text style = {styles.textBox}>Hey! I'm from the Netherlands, and I'm looking to
                join a volleyball team for the UBC Intramurals! I love playing the guitar in my spare
                time. Maybe we can have jam sessions after practices!
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20
    },
    textHeader: {
        fontSize: 20,
        marginBottom: 10
    },
    textBox: {
        fontSize: 16,
        color: 'rgba(0,0,0, 0.6)'
    }
});