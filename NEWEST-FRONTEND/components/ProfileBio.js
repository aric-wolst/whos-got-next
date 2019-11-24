import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";


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
        textAlign: "center",
        fontSize: 16,
        color: "rgba(0,0,0, 0.6)"
    },
    editable: {
        backgroundColor: "lightgrey",
        width: "100%",
        paddingTop: 3,
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
                <TextInput multiline = {true} editable = {isEditing} maxLength = {200} style = {[styles.textBox, ...editableStyle]} onChangeText={(text) => {this.setState({ description: text});}} value={this.state.description} />
            </View>
        );
    }
}
