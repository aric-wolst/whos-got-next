import React, { Component } from "react";
import {StyleSheet, ScrollView, View, Text, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, AsyncStorage, FlatList } from "react-native";
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
    header: {
        backgroundColor: "#ff8c00",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 35,
        marginLeft: 5,
        marginRight: 5,
        fontWeight: "bold",
        color: "white",
        alignSelf: "center",
        textAlign: "center",
    },
    sportText: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 35,
        fontWeight: "bold",
        color: "#ff8c00",
        alignSelf: "center",
        textAlign: "center",
    },
    location: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 20,
        marginLeft: 5,
        marginRight: 5,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center",
        textAlign: "center",
    },
    dateText: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center",
        textAlign: "center",
    },
    bio: {
        color: "black",
        alignSelf: "center",
        textAlign: "center",
        fontSize: 18,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    organizerTitle: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center",
        textAlign: "center",
    },
    organizer:{
        textAlign: "center",
        fontSize: 20,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    },
    playersTitle: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center",
        textAlign: "center",
    },
    players:{
        textAlign: "center",
        fontSize: 20,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        alignSelf: "center"
    },
    joinButton: {
        width: "40%", 
        borderRadius: 10, 
        padding: 12, 
        backgroundColor: "#ff8c00", 
        borderColor: "#ff8c00", 
        borderWidth: 3,
        marginLeft: "30%",
        marginRight: "30%",
        marginBottom: "2%",
        marginTop: "2%"
    },
    joinText: {
        color: "black", 
        fontWeight: "bold", 
        fontSize: 17,
        alignSelf: "center"
    },
    leaveButton: {
        width: "40%", 
        borderRadius: 10, 
        padding: 12, 
        backgroundColor: "white", 
        borderColor: "#ff8c00", 
        borderWidth: 3,
        marginRight: "30%",
        marginLeft: "30%",
        marginBottom: "2%",
        marginTop: "2%"
    },
    leaveText: {
        color: "black", 
        fontWeight: "bold", 
        fontSize: 17,
        alignSelf: "center"
    },
});

/* Displays information about an event */
class TeamProfile extends Component {
    
    /* Page header */
    static navigationOptions = {
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#ff8c00",
        },
        headerBackTitleStyle: {
            color: "white",
            fontWeight: "bold"
        },
        headerBackImageStyle: {
            tintColor: "white",
        }
    };

    constructor(props) {
        super(props);
        this.state = {
          refreshing: true,
          dataSource: null,
          joinedEvent: false,
         };
        this._getData();
    }

    onRefresh() {
        this.setState({ dataSource: []});
        this._getData();
    }

    /* Takes the date and formats it to a readable state */
    formatDate(data) {
        var date = new Date(data);
        var ampm = "AM";

        var hour = date.getUTCHours();
        var min = date.getUTCMinutes();
        
        if(hour > 12 && hour <= 23){
            hour = hour % 12;
            ampm = "PM";
        } else if(hour === 24){
            hour = 12;
        }

        if(min < 10){
            min = "0" + min;
        }
        
        return hour + ":" + min + " " + ampm + " " + (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + "/" + date.getFullYear();
    }

    _getData = async () => {
        const { navigation } = this.props;

        try {
            const eventInfo = await backendRequest("/events/" + navigation.getParam("id", "invalid_id"),{},"GET");
            this.setState({
             refreshing: false,
             dataSource: eventInfo,
            });
            this.joinStatus();

        } catch(error) {
            Alert.alert("Get Event Info Error",error.message);
        }
    }

    joinStatus = async () => {
        const userId = await AsyncStorage.getItem(config.userIdKey);
        var playerIds = this.state.dataSource.players.map((player) => {player._id;});
        const organizerIds = this.state.dataSource.organizers.map((organizer) => {organizer._id;});
        console.log(this.state.dataSource.players);
        var joined = (playerIds.includes(userId.toString()) || organizerIds.includes(userId.toString()));

        this.setState({
            joinedEvent: joined
        });
    }

    join = async () => {
        const userId = await AsyncStorage.getItem(config.userIdKey);
        const eventId = this.state.dataSource._id;
        try{
            if(this.state.joinedEvent){
                await backendRequest("/events/" + eventId + "/requests/" + userId + "/leave", {}, "PUT", {});
                this.setState({
                    joinedEvent: false
                });
            } else {
                await backendRequest("/events/" + eventId + "/requests/" + userId + "/join", {}, "PUT", {});
                this.setState({
                    joinedEvent: true
                });
            }
            this.onRefresh();
        } catch(error){
            Alert.alert("Cannot join event",error.message);
        }
    }

    buttonStyle(){
        if(this.state.joinedEvent){
            return {
                width: "40%", 
                borderRadius: 10, 
                padding: 12, 
                backgroundColor: "white", 
                borderColor: "#ff8c00", 
                borderWidth: 3,
                marginRight: "30%",
                marginLeft: "30%",
                marginBottom: "2%",
                marginTop: "2%",
                alignSelf: "center"
            };
        } else {
            return {
                width: "40%", 
                borderRadius: 10, 
                padding: 12, 
                backgroundColor: "#ff8c00", 
                borderColor: "#ff8c00", 
                borderWidth: 3,
                marginLeft: "30%",
                marginRight: "30%",
                marginBottom: "2%",
                marginTop: "2%",
                alignSelf: "center"
            };
        }
    }

    /* Displays the information about the event, given the parameters passed to the page */
    render(){
        /* Renders a spinning wheel if we are refreshing */
        if(this.state.refreshing){
            return( 
                <View style={styles.loader}> 
                    <ScrollView>
                        <ActivityIndicator size="large" color="black"/>
                    </ScrollView>
                </View>
        );}

        return(
            <View style={{flex:1}}>
                <ScrollView 
                    style = {{flexDirection: "column"}}
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                      />}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {this.state.dataSource.name}
                        </Text>
                    </View>
                    <View style={styles.subheader}>
                        <Text style={styles.sportText}>
                            {this.state.dataSource.sport}
                        </Text>
                        <Text style={styles.location}>
                            {this.state.dataSource.address}
                        </Text>
                        <Text style={styles.dateText}>
                            {this.formatDate(this.state.dataSource.date)}
                        </Text>
                    </View>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <Text style={styles.bio}>
                        {this.state.dataSource.description}
                    </Text>
                    <Text style={styles.organizerTitle}>
                        Organizer
                    </Text>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    {this.state.dataSource.organizers.map((organizer) => (
                        <Text key={organizer._id} style={styles.organizer}>
                            {organizer.firstName}
                        </Text>
                    ))}
                    <Text style={styles.playersTitle}>
                        Players
                    </Text>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <View style={styles.container}>
                        { this.state.dataSource.players.map((item) => (
                            <Text key={item._id} style={styles.players}> {item.firstName} </Text>)
                        )}
                    </View>
                </ScrollView>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={this.buttonStyle()} onPress = {() => this.join()}>
                        <Text style={styles.joinText}>
                            {this.state.joinedEvent? "Leave Event" : "Join Event"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default TeamProfile;