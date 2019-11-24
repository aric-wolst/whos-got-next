import React, { Component } from "react";
import { AsyncStorage, StyleSheet, ScrollView, Alert, FlatList, View, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import backendRequest from "../utils/RequestManager";
import config from "../config";

/* Style sheet for rendered items */
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
        backgroundColor: "#ff8c00",
        padding: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    createEventText: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        color: "#ff8c00",
    },
  });

/* Displays the page with all events within 5km and the create event button */
class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
          refreshing: true,
          dataSource: null,
          location: null,
         };
        this._getData();
    }

    /* Page header */
    static navigationOptions = {
        headerTitle: "Live Events",
        headerStyle: {
          backgroundColor: "#ff8c00",
          color: "white",
          textAlign: "center",
          alignContent: "center",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "white",
          fontSize: 30,
          alignSelf: "center",
          textAlign: "center"
        },
    };

    _getData = async () => {
        /* Get user's current location */
        await this._getLocationAsync();
        try {
            const events = await backendRequest("/events/nearby", {
                longitude: this.state.location.coords.longitude,
                latitude: this.state.location.coords.latitude
            }, "GET");
            this.setState({
             refreshing: false,
             dataSource: events
            });
            const userId = await AsyncStorage.getItem(config.userIdKey);
            const userLocation = {coordinates: [
                this.state.location.coords.longitude,
                this.state.location.coords.latitude],
                type: "Point",};
            backendRequest("/users/" + userId, {}, "PUT", {
                "location": userLocation,
            });
        } catch(error) {
            Alert.alert("Get Event Data Error",error.message);
        }
    }

    /* When the page is pulled down, it refreshes, sets the datasource to empty and calls _getData */
    onRefresh() {
        this.setState({ dataSource: [] });
        this._getData();
    }

    /* Gets user's current location */
    _getLocationAsync = async () => {

        /* Gets permission to retrieve user's location */
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
          this.setState({
            errorMessage: "Permission to access location was denied",
          });
        }

        /* Sets location to the highest possible accuracy */
        const locationSettings = {
            accuracy: Location.Accuracy.Highest,
        };

        /* Sets the location state to the current location */
        let location = await Location.getCurrentPositionAsync(locationSettings,{});
        this.setState({
            location
        });
    };

    /* Styling line separator between events */
    FlatListItemSeparator = () => {
        return (
          <View style={{
             height: 0.5,
             width:"80%",
             backgroundColor:"#ff8c00",
             alignSelf: "center",
             marginTop: "0.25%",
             marginBottom: "0.25%"
          }}
        />
        );
    }

    /* Takes the date and formats it to a readable state */
    formatDate(date) {
        var dateFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric"};
        return new Date(date).toLocaleDateString("en-CA", dateFormatOptions);
    }
    
    /* Renders each individual event, that redirects to e new page when the event is pressed */
    renderItem = (data) =>
    <View style = {{flexDirection: "row"}}>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate("TeamProfile", {
            eventName: data.item.name,
            sport: data.item.sport,
            eventBio: data.item.description,
            date: data.item.date,
            location: data.item.address,
            organizer: data.item.organizers,
            players: data.item.players,
            id: data.item._id
        });}}>
            <View style = {{height: 150, width: "100%"}}>
                <Text style={styles.sport}>{data.item.sport}</Text>
                <Text style={styles.titleName}>{data.item.name}</Text>
                <Text style={styles.date}>{this.formatDate(data.item.date)}</Text>
                <Text style={styles.location}>{data.item.address}</Text>
            </View>
        </TouchableOpacity>
    </View>

    render() {
        /* Renders a spinning wheel if we are refreshing */
        if(this.state.refreshing){
            return(
              <View style={styles.loader}>
                    <ScrollView>
                        <ActivityIndicator size="large" color="black"/>
                    </ScrollView>
              </View>
        );}

        /* Renders the page with the create event button and nearby events */
        return(
            <View style={{flex:1}}>
                <ScrollView
                refreshControl={
                                <RefreshControl
                                  refreshing={this.state.refreshing}
                                  onRefresh={this.onRefresh.bind(this)}
                                />
                }>
                    <TouchableOpacity /* Create event button */
                        style={{height: 70, textAlign: "center", justifyContent:"center", alignContent: "center"}}
                        onPress = {() => this.props.navigation.navigate("CreateEvent", {
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            })}>
                        <Text style = {styles.createEventText}>Create Event</Text>
                    </TouchableOpacity>
                    <View style={{height: 5, width:"100%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <View style={styles.container}>
                        {<FlatList
                            /* Creates each event */
                            data = {this.state.dataSource}
                            ItemSeparatorComponent = {this.FlatListItemSeparator}
                            renderItem= {(item) => this.renderItem(item)}
                            keyExtractor={(item) => item._id}
                        />}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Teams;
