import React, { Component } from "react";
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text, ActivityIndicator, TouchableOpacity, ListView } from "react-native";
import { createStackNavigator } from "react-navigation-stack";

/* Style sheet for rendered items */
const styles = StyleSheet.create({
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

    },
    playersTitle: {
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
    players:{

    },
    joinButton: {
        width: "40%", 
        borderRadius: 10, 
        padding: 12, 
        backgroundColor: "#ff8c00", 
        borderColor: "#ff8c00", 
        borderWidth: 3,
        marginLeft: "8%",
        marginRight: "2%",
        marginBottom: "2%"
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
        marginRight: "8%",
        marginLeft: "2%",
        marginBottom: "2%"
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

    /* Displays the information about the event, given the parameters passed to the page */
    render(){
        const { navigation } = this.props;
        return(
            <View style={{flex:1}}>
                <ScrollView style = {{flexDirection: "column"}}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            {navigation.getParam("eventName", "No Event Name")}
                        </Text>
                    </View>
                    <View style={styles.subheader}>
                        <Text style={styles.sportText}>
                            {navigation.getParam("sport", "No Sport Specified")} 
                        </Text>
                        <Text style={styles.location}>
                            {navigation.getParam("location", "No Location Specified")}
                        </Text>
                        <Text style={styles.dateText}>
                            {this.formatDate(navigation.getParam("date", "No League Specified"))}
                        </Text>
                    </View>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <Text style={styles.bio}>
                        {navigation.getParam("eventBio", " ")}
                    </Text>
                    <Text style={styles.organizerTitle}>
                        Organizer
                    </Text>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <Text>
                        {navigation.getParam("organizer", " ")}
                    </Text>
                    <Text style={styles.playersTitle}>
                        Players
                    </Text>
                    <View style={{height: 0.5, width:"80%", backgroundColor:"#ff8c00", alignSelf: "center"}}/>
                    <Text>
                        {navigation.getParam("players", " ")}
                    </Text>
                </ScrollView>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={styles.joinButton}>
                        <Text style={styles.joinText}>
                            Join Event
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.leaveButton}>
                        <Text style={styles.leaveText}>
                            Leave Event
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default TeamProfile;