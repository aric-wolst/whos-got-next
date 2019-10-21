import React, { Component } from 'react';
import { AsyncStorage, Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text, ActivityIndicator, TouchableOpacity, ListView, RefreshControl } from 'react-native';
import FindTeamsHeader from '../components/FindTeamsHeader';
import { createStackNavigator } from 'react-navigation-stack';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import backendRequest from "../utils/RequestManager";
import config from '../config';

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
          refreshing: true,
          dataSource: null,
          location: null,
         };
        this.GetData();
    }

    static navigationOptions = {
        headerTitle: "Live Events",
        headerStyle: {
          backgroundColor: '#ff8c00',
          color: 'white',
          textAlign: 'center',
          alignContent: 'center',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
          fontSize: 30,
          alignSelf: 'center',
          textAlign: 'center'
        },
    };

    GetData = () =>{
        this._getLocationAsync().then(() => {
        fetch("http://34.220.132.159/events/nearby?longitude=" + this.state.location.coords.longitude + "&latitude=" + this.state.location.coords.latitude, {
            method: "GET",
        })
        .then(response => response.json())
        .then((responseJson)=> {
          this.setState({
           refreshing: false,
           dataSource: responseJson
          })
        })
        .then(() => AsyncStorage.getItem(config.userIdKey))
        .then((userId) => {
            var userLocation = {coordinates: [this.state.location.coords.longitude, this.state.location.coords.latitude], type: "Point",};
            backendRequest('/users/' + userId, {}, 'PUT', {
                "location": userLocation,
            })
        })
        .catch(error=>console.log(error))
        })
    }

    onRefresh() {
        this.setState({ dataSource: [] });
        this.GetData();
      }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }

        const locationSettings = {
            accuracy: Location.Accuracy.Highest,
        }
    
        let location = await Location.getCurrentPositionAsync(locationSettings,{});
        this.setState({
            location: location 
        });
        console.log(location);
    };
    
    FlatListItemSeparator = () => {
        return (
          <View style={{
             height: 0.5,
             width:"80%",
             backgroundColor:"#ff8c00",
             alignSelf: "center"
        }}
        />
        );
    }

    formatDate(data) {
        var hour = new Date(data);
        var min = new Date(data);
        var day = new Date(data);
        var month = new Date(data);
        var ampm = "AM";
        var year = new Date(data);

        hour = hour.getUTCHours();
        min = min.getUTCMinutes();
        day = day.getUTCDate();
        month = month.getUTCMonth() + 1;
        year = year.getFullYear();
        
        if(hour > 12){
            hour = hour % 12;
            ampm = "PM"
        }

        if(min < 10){
            min = "0"+min;
        }
        
        var date = hour + ":" + min + " " + ampm + " " + month + "/" + day + "/" + year;
        return date;
    }
        
    renderItem=(data)=>
    <View style = {{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('TeamProfile', {
            eventName: data.item.name,
            sport: data.item.sport,
            eventBio: data.item.description,
            date: data.item.date,
            location: data.item.address
        })}}>
            <View style = {{height: 150, width: '100%'}}>
                <Text style={styles.sport}>{data.item.sport}</Text>
                <Text style={styles.titleName}>{data.item.name}</Text>
                <Text style={styles.date}>{this.formatDate(data.item.date)}</Text>
                <Text style={styles.location}>{data.item.address}</Text>
            </View>
        </TouchableOpacity>
    </View>
    
    render() {
        if(this.state.refreshing){
            return( 
              <View style={styles.loader}> 
                <ActivityIndicator size="large" color="black"/>
              </View>
        )}

        return(
            <View>
                <ScrollView
                refreshControl={
                                <RefreshControl
                                  refreshing={this.state.refreshing}
                                  onRefresh={this.onRefresh.bind(this)}
                                />
                              }>
                    <TouchableOpacity 
                        style={{height: 70, textAlign: 'center', justifyContent:'center', alignContent: 'center'}}
                        onPress = {() => this.props.navigation.navigate('CreateEvent', {
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            })}>
                        <Text style = {styles.createEventText}>Create Event</Text>
                    </TouchableOpacity>
                    <View style={{height: 5, width:"100%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <View style={styles.container}>
                        {<FlatList
                            data = {this.state.dataSource}
                            ItemSeparatorComponent = {this.FlatListItemSeparator}
                            renderItem= {item=> this.renderItem(item)}
                            keyExtractor={(item) => item._id}
                        /> }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Teams;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff"
     },
    loader:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff"
     },
    list:{
      paddingVertical: 4,
      margin: 5,
      backgroundColor: "#fff"
     },
    date:{
        fontSize: 17,
        marginTop: 3,
        marginLeft: 8
    },
    location:{
        fontSize: 15,
        marginBottom: 8,
        marginTop: 3,
        marginLeft: 8
    },
    sport:{
        fontWeight: "bold",
        fontSize: 25,
        marginTop: 8,
        marginLeft: 8,
        color: "#ff8c00"
    },
    titleName:{
        fontWeight: "bold",
        fontSize: 22,
        marginTop: 3,
        marginLeft: 8,
        color: "black"
    },
    info:{
        width: 60, 
        height: 60, 
        borderRadius: 60/2, 
        backgroundColor: '#ff8c00', 
        padding: 8, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    createEventText: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#ff8c00',
    },
  });