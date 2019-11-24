import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";


const styles = StyleSheet.create({
    FindEventsHeaderBackground: {
        backgroundColor: "white",
        alignItems: "center"
    },
    FindEvents: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 32,
        fontWeight: "bold",
        color: "#ff8c00",
    },
});

export default class FindEventsHeader extends Component {
    render() {
        return(
            <View style = {styles.FindEventsHeaderBackground}>
                <Text style = {styles.FindEvents}>Find Live Events</Text>
            </View>
        );
    }
}
