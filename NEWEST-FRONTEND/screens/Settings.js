import React, { Component } from "react";
import { TextInput, KeyboardAvoidingView, Alert, AsyncStorage, SafeAreaView, StyleSheet, ScrollView, Button, View, Text } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import backendRequest from "../utils/RequestManager";
import config from "../config";
import { Tester, TestHookStore } from "cavy";
import SettingsSpec from "../specs/SettingsSpec";
import TestSettings from "./SettingsForm";

const testHookStore = new TestHookStore();

export default class Settings extends Component {

    render() {
        return(
            <Tester specs = {[SettingsSpec]} store = {testHookStore}>
                <TestSettings/>
            </Tester>
        );
    }
    
}
