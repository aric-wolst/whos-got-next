import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileBio from '../components/ProfileBio';
import Legend from '../components/Legend';
import Data from '../components/Data';
import Constants from 'expo-constants';
import SportCell from '../components/SportCell'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.initData = Data;
        this.state = {
            isLoading: true,
            id: 'default',
            firstName: '',
            lastName: '',
            email: '',
            birthday: '',
            description: '',
            sports: [],
        };
    }

    componentDidMount() {
      return fetch('http://34.220.132.159/users/' + this.props.id)
      .then( (response) => response.json() )
      .then ( (responseJson) => {
        //console.log(responseJson);
        this.setState({
          isLoading: false,
          id: this.props.id,
          firstName: responseJson.firstName,
          lastName: responseJson.lastName,
          email: responseJson.email,
          birthday: responseJson.birthday,
          description: responseJson.description,
          sports: responseJson.sports,
        });
      })
      .catch ( (error)  => {
        console.log(error);
      });
      
    }

    renderItem = ({item}) => {
      return (
        <SportCell sport = {item.sport} level = {item.level} />
      );
    }


    render() {
        return (
            <View>
                <ProfileHeader firstName = {this.state.firstName} birthday = {this.state.birthday} />
                <ScrollView>
                    <ProfileBio description = {this.state.description} />
                    <Legend />
                    <SafeAreaView>
                        <FlatList
                            data = {this.state.sports}
                            renderItem={this.renderItem}
                            keyExtractor={(item) => item.sport}
                        />
                    </SafeAreaView>
                </ScrollView>
            </View>
        );
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sportTab: {
      flexDirection: 'row',
      marginVertical: 2,
      marginHorizontal: 10,
      flex: 1,
      borderWidth: 0,
      borderColor: 'rgba(0,0,0,0.4)',
      borderRadius: 10
    },
    sportIcon: {
      height: 60,
      width: 60,
      margin: 5
    },
    position: {
      fontSize: 36,
    },
    level: {
      fontSize: 12,
      fontStyle: 'italic'
    },
    logo: {
      flex: 1,
      flexDirection: 'row'
    },
    label: {
      flex: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  });