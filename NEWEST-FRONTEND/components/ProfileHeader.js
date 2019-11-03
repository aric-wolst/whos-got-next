import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Image } from "react-native";

export default class ProfileHeader extends Component {
    render() {
        return(
            <View style = {styles.headerBackground}>
                <View style = {styles.header}>
                    <View style = {styles.profilepicWrap}>
                        <Image style = {styles.profilepic} source={require("../img/profilepic.jpg")} />
                    </View>

                    <View style = {styles.personalInfo}>
                        <Text style = {styles.name}>{this.props.firstName}</Text>
                        <Text style = {styles.age}>{this.props.birthday}</Text>
                        <Text style = {styles.genderAndHeight}>{this.props.gender}</Text>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    headerBackground: {
        backgroundColor: "#ff8c00",
        paddingBottom: 10
    },
    header: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    profilepicWrap: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 10,
        borderColor: "rgba(0,0,0, 0.4)",
    },
    sportIcons: {
        width: 20,
        height: 20
    },
    profilepic: {
        flex: 1,
        width: null,
        borderRadius: 100,
        borderColor: "#fff",
        borderWidth: 4
    },
    name: {
        marginTop: 20,
        fontSize: 28,
        fontWeight: "bold",
        color: "black",
        textAlign: "right"
    },
    genderAndHeight: {
        fontSize: 14,
        color: "black",
        textAlign: "right"
    },
    age: {
        fontSize: 14,
        color: "black",
        fontWeight: "300",
        textAlign: "right"
    },
    personalInfo: {
        justifyContent: "center"
    },
    sportInfo: {
        flexDirection: "row",
        justifyContent: "flex-end",
        textAlign: "right"
    }
});