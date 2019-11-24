/* global require */

import React, { Component } from "react";
import {StyleSheet, Text, TextInput, View, Image } from "react-native";
import layout from "../utils/Layout";

const styles = StyleSheet.create({
    headerBackground: {
        backgroundColor: layout.color.mainColor,
        padding: 16,
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
    infoFieldColumn: {
        flex: 1,
        flexDirection: "column",
        marginRight: 8,
    },
    infoFieldDescription: {
        flex: 1,
        color: "#fff",
        fontWeight: "normal"
    },
    name: {
        marginVertical: 3,
        fontSize: 26,
        fontWeight: "bold"
    },
    profileInfo: {
        marginVertical: 3,
        fontSize: 14
    },
    editable: {
        borderBottomColor: "#fff",
        borderBottomWidth: 1
    },
    personalInfo: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: "center",
        flexDirection: "row"
    }
});

export default class ProfileHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.firstName,
            gender: this.props.gender
        };
    }

    render() {
        const isEditing = this.props.isEditingProfile;
        const editableStyle = (isEditing) ? [styles.editable] : [];
        return(
            <View style = {styles.headerBackground}>
            <Image style = {styles.profilepic} source={require("../assets/img/profilepic.jpg")} />
            <View style = {styles.personalInfo}>
                {isEditing &&
                    <View style={styles.infoFieldColumn}>
                    <Text style = {[styles.name, styles.infoFieldDescription]}>Name</Text>
                    <Text style = {[styles.profileInfo, styles.infoFieldDescription]}>Gender</Text>
                    </View>
                }
                <View style={styles.infoFieldColumn}>
                    <TextInput editable = {isEditing} style = {[styles.name, ...editableStyle]} onChangeText={(text) => {this.setState({ firstName: text});}} value={this.state.firstName} />
                    <TextInput editable = {isEditing} style = {[styles.profileInfo, ...editableStyle]} onChangeText={(text) => {this.setState({ gender: text});}} value={this.state.gender} />
                </View>
            </View>
            </View>
        );
    }
}
