import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from 'react-native';
import Profile from './Profile';

class MyProfile extends Component {

    constructor(props) {
        super(props);
        this.initData = Data;
        this.state = {
            isLoading: true,
            id: '',
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('myId')
        .then((userId) => {
            this.setState({
                isLoading: false,
                id: userId,
            });
        });
    }

    
    render() {
        if(this.state.isLoading) {
            return <ActivityIndicator />
        } else {
            return <Profile id = {this.state.id}/>
        }
    }

}

export default MyProfile;