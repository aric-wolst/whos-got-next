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
        margin: 5,
    }
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
        
        if(hour > 12 && hour <= 23){
            hour = hour % 12;
            ampm = "PM";
        } else if(hour == 24){
            hour = 12;
        }

        if(min < 10){
            min = "0" + min;
        }
        
        var date = hour + ":" + min + " " + ampm + " " + month + "/" + day + "/" + year;
        return date;
    }

    /* Displays the information about the event, given the parameters passed to the page */
    render(){
        const { navigation } = this.props;
        return(
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
            </ScrollView>
        );
    }
}

export default TeamProfile;
