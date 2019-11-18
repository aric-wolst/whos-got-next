import React, { Component } from "react";
import { AsyncStorage, Alert, SafeAreaView, StyleSheet, Button, View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import backendRequest from "../utils/RequestManager";
import config from "../config";
import { Tester, TestHookStore } from "cavy";
import CreateEventSpec from "../specs/CreateEventSpec";
import TestCreateEvent from "./CreateEventForm";

const testHookStore = new TestHookStore();

export default class CreateEvent extends Component {

    render() {
        return(
            <Tester specs = {[CreateEventSpec]} store = {testHookStore}>
                <TestCreateEvent/>
            </Tester>
        );
    }
}


    

