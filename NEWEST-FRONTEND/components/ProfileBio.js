import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Image } from "react-native";


const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 20
    },
    textHeader: {
        fontSize: 20,
        marginBottom: 10
    },
    textBox: {
        fontSize: 16,
        color: "rgba(0,0,0, 0.6)"
    }
});

export default class ProfileBio extends Component {
    render() {
        return(
            <View style = {styles.header}>
                <Text style = {styles.textHeader}>BIO</Text>
                <Text style = {styles.textBox}>{this.props.description}</Text>
            </View>
        );
    }

}
