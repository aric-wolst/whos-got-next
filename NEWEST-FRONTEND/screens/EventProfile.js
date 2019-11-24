import React, { Component } from "react";
import {Button, StyleSheet, ScrollView, View, Text, ActivityIndicator, TouchableOpacity, Alert, AsyncStorage } from "react-native";
import backendRequest from "../utils/RequestManager";
import config from "../config";
import formatDate from "../utils/formatDate";

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
        marginTop: 5,
        alignSelf: "center"
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
    joinText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 17,
        alignSelf: "center"
    },
    joinOrLeaveButton: {
        width: "40%",
        borderRadius: 10,
        padding: 12,
        borderWidth: 3,
        marginHorizontal: "30%",
        marginVertical: "2%",
        alignSelf: "center",
        borderColor: "#ff8c00"
    },
    joinButton: {
        backgroundColor: "#ff8c00"
    },
    leaveButton: {
        backgroundColor: "white"
    },
    deleteButton: {
        backgroundColor: "#ff8c00"
    }
});

/* Displays information about an event */
class EventProfile extends Component {

    /* Page header */
    static navigationOptions = {
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#ff8c00" },
        headerBackTitleStyle: { color: "white", fontWeight: "bold" },
        headerBackImageStyle: { tintColor: "white" }
    };

    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          hasJoinedEvent: false,
            isOrganizer: false
        };
        this._getData();
    }

    _getData = async () => {
        const { navigation } = this.props;

        backendRequest("/events/" + navigation.getParam("id"),{},"GET").then((event) => {
            this.setState({
             isLoading: false,
             event
            });
            this.getJoinedStatus();
        }).catch((error) => { Alert.alert("Get Event Info Error", error.message); });
    }

    getJoinedStatus = async () => {
        const userId = await AsyncStorage.getItem(config.userIdKey);
        const organizerIds = this.state.event.organizers.map((organizer) => organizer._id);
        const isOrganizer = organizerIds.includes(userId.toString());
        const playerIds = this.state.event.players.map((player) => player._id);
        const hasJoinedEvent = (playerIds.includes(userId.toString()) || isOrganizer);
        this.setState({ hasJoinedEvent, isOrganizer });
    }

    _joinOrLeaveEvent = async () => {
        const userId = await AsyncStorage.getItem(config.userIdKey);
        const eventId = this.state.event._id;
        const leaveOrJoin = (this.state.hasJoinedEvent) ?  "/leave" : "/join";
        backendRequest("/events/" + eventId + "/requests/" + userId + leaveOrJoin, {}, "PUT", {}).then((event) => {
            this.setState({
                hasJoinedEvent: !this.state.hasJoinedEvent,
                event
            });
        }).catch((error) => {
            Alert.alert("Cannot join event", error.message);
        });
    }

    deleteEvent = async () => {
        const userId = await AsyncStorage.getItem(config.userIdKey);
        const eventId = this.state.event._id;
        backendRequest("/events/" + eventId, {}, "DELETE", {}).catch((error) => {
            Alert.alert("Cannot delete event", error.message);
        }).then(this.props.navigation.goBack(null));

    }

    /* Displays the information about the event, given the parameters passed to the page */
    render(){
        // Renders a spinning wheel if we are refreshing.
        if(this.state.isLoading){
            return(
                <View style={styles.loader}>
                    <ScrollView>
                        <ActivityIndicator size="large" color="black"/>
                    </ScrollView>
                </View>
        );}
        const buttonStyles = (this.state.hasJoinedEvent) ? [styles.joinOrLeaveButton, styles.leaveButton] : [styles.joinOrLeaveButton, styles.joinButton];
        return(
            <View style={{flex:1}}>
                <ScrollView style = {{flexDirection: "column"}}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {this.state.event.name}
                        </Text>
                    </View>
                    <View style={styles.subheader}>
                        <Text style={styles.sportText}>
                            {this.state.event.sport}
                        </Text>
                        <Text style={styles.location}>
                            {this.state.event.address}
                        </Text>
                        <Text style={styles.dateText}>
                            {formatDate(this.state.event.date)}
                        </Text>
                    </View>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <Text style={styles.bio}>
                        {this.state.event.description}
                    </Text>
                    <Text style={styles.organizerTitle}>
                        Organizer
                    </Text>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    {this.state.event.organizers.map((organizer) =>
                        (
                            <TouchableOpacity key={organizer._id} style={styles.organizer} onPress={() => {
                                this.props.navigation.navigate("PublicPlayerProfile", {
                                    user: this.state.event.organizers.filter((user) => (user._id === organizer._id))[0]
                                });
                            } }>
                                <Text style = {{fontSize: 18, color: "#007AFF"}}>{organizer.firstName}</Text>
                            </TouchableOpacity>
                        )
                    )}
                    <Text style={styles.playersTitle}>
                        Players
                    </Text>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <View style={styles.container}>
                        { this.state.event.players.map((player) =>
                            (
                                <TouchableOpacity key={player._id} style={styles.players} onPress={() => {
                                    this.props.navigation.navigate("PublicPlayerProfile", {
                                        user: this.state.event.players.filter((user) => (user._id === player._id))[0]
                                    });
                                } }>
                                    <Text style = {{fontSize: 18, color: "#007AFF"}}>{player.firstName}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </ScrollView>
                {(!this.state.isOrganizer) && <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={buttonStyles} onPress = {() => this._joinOrLeaveEvent()}>
                        <Text style={styles.joinText}>
                            {(this.state.hasJoinedEvent) ? "Leave Event" : "Join Event"}
                        </Text>
                    </TouchableOpacity>
                </View>}
                    {(this.state.isOrganizer) && <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={buttonStyles} onPress = {() => this.deleteEvent()}>
                    <Text style={styles.joinText}>
                    {"Delete Event"}
                    </Text>
                    </TouchableOpacity>
                    </View>}
            </View>
        );
    }
}

export default EventProfile;
