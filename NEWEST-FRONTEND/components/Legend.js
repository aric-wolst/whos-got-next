import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

export default class Legend extends Component {
    render() {
        return(
            <View style = {styles.container}>
                <View style = {{backgroundColor: "#fbdC9d", flex: 1}}><Text style = {styles.label}>Beginner</Text></View>
                <View style = {{backgroundColor: "#fec044", flex: 1}}><Text style = {styles.label}>Intermmediate</Text></View>
                <View style = {{backgroundColor: "#ff8c00", flex: 1}}><Text style = {styles.label}>Elite</Text></View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 5,
        marginHorizontal: 10
    },
    label: {
        fontSize: 11,
        textAlign: "center"
    }
    
});