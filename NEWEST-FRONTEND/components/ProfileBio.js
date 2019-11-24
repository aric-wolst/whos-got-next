import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Image, TextInput } from "react-native";


const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 20
    },
    textHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    textBox: {
        fontSize: 16,
        color: "rgba(0,0,0, 0.6)"
    },
    editable: {
        borderBottomColor: "#000",
        borderBottomWidth: 3,
    }
});

export default class ProfileBio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: this.props.description,
        };
    }

    render() {
        const isEditing = this.props.isEditingProfile;
        const editableStyle = (isEditing) ? [styles.editable] : [];
        return(
            <View style = {styles.header}>
                <Text style = {styles.textHeader}>BIO</Text>
                <TextInput editable = {isEditing} style = {[styles.textBox, ...editableStyle]} onChangeText={(text) => {this.setState({ description: text});}} value={this.state.description} />
            </View>
        );
 {   }
m}
}
