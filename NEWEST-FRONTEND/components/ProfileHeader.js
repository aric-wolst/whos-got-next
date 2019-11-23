/* global require */

import React, { Component } from "react";
import {StyleSheet, Text, View, Image } from "react-native";
import layout from "../utils/Layout";

const styles = StyleSheet.create({
    headerBackground: {
        backgroundColor: layout.color.mainColor,
        paddingTop: 44,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: "row"
    },
    profilepic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#fff",
    },
    sportIcons: {
        width: 20,
        height: 20
    },
    name: {
        fontSize: 26,
        fontWeight: "bold"
    },
    profileInfo: {
        fontSize: 14
    },
    personalInfo: {
        marginHorizontal: 20,
        justifyContent: "center"
    }
});

export default class ProfileHeader extends Component {
    render() {
        return(
            <View style = {styles.headerBackground}>
            <Image style = {styles.profilepic} source={require("../assets/img/profilepic.jpg")} />
            <View style = {styles.personalInfo}>
                <Text style = {styles.name}>{this.props.firstName}</Text>
                <Text style = {styles.profileInfo}>{this.props.birthday}</Text>
                <Text style = {styles.profileInfo}>{this.props.gender}</Text>
            </View>
            </View>
        );
    }
}
