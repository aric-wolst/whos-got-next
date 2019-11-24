import React, { Component } from "react";
import { AsyncStorage, Alert, SafeAreaView, StyleSheet, Button, View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import backendRequest from "../utils/RequestManager";
import config from "../config";
import * as Localization from "expo-localization";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 60,
        paddingRight: 60,
    },
    form: {
        alignSelf: "stretch",
    },
    header: {
        fontSize: 24,
        paddingBottom: 10,
        borderBottomColor: "#ff8c00",
        borderBottomWidth: 3,
    },
    textinput: {
        alignSelf: "stretch",
        height: 40,
        marginTop: 5,
        marginBottom: 20,
        borderColor: "#ff8c00",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    textinputdescription: {
        alignSelf: "stretch",
        height: 100,
        marginTop: 5,
        marginBottom: 20,
        borderColor: "#ff8c00",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    }
});

export default class CreateEvent extends Component {
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
            sport: "",
            eventName: "",
            eventDescription: "",
            duration: "",
        };
        this.postEvent=this.postEvent.bind(this);
    }

    postEvent = async () => {
        if(this.state.sport === "" ||
           this.state.eventName === "" ||
           this.state.duration === "") {
               Alert.alert("Invalid Entry", "Please make sure to fill in all fields.");
        } else {
            const userId = await AsyncStorage.getItem(config.userIdKey);
            const { navigation } = this.props;
            var latitude = navigation.getParam("latitude", 0);
            var longitude = navigation.getParam("longitude", 0);
            //var utcDate = new Date((new Date()).toUTCString());
            //utcDate.setHours(utcDate.getHours()-7);
           // var today = new Date(utcDate);
            var deviceTimezone = Localization.timezone;
            var userArray = new Array();
            userArray[0] = userId;
            var eventLocation = {coordinates: [longitude, latitude], type: "Point",};
            backendRequest("/events",{}, "POST", {
                "name": this.state.eventName,
                "organizers": userArray,
                "players": userArray,
                "description": this.state.eventDescription,
                "location": eventLocation,
                "pendingPlayerRequests": [],
                "sport": this.state.sport,
                "timezone": deviceTimezone,
                "duration": this.state.duration,
            }).then( () => {
                Alert.alert("Success", "You have created a new event!");
                this.setState({
                    sport: "",
                    eventName: "",
                    eventDescription: "",
                    duration: "",
                });
                this.props.navigation.goBack(null);
            });
        }
    }

    render() {

        let timeIntervals = [{
            value: "1 hour",
        }, {
            value: "2 hours",
        }, {
            value: "3 hours",
        }];
        let sportsData = [{
            value: "Badminton",
          }, {
            value: "Baseball",
          }, {
            value: "Basketball",
          }, {
            value: "Cricket",
          }, {
            value: "Football",
          }, {
            value: "Handball",
          }, {
            value: "Hockey",
          }, {
            value: "Rugby",
          }, {
            value: "Soccer",
          }, {
            value: "Street Fighting",
          }, {
            value: "Squash",
          }, {
            value: "Tennis",
          }, {
            value: "Volleyball",
          }];

        return(
            <KeyboardAvoidingView style={{ flex: 1 }} behavior = "padding" enabled>
                <View style={styles.container}>
                    <Text style = {styles.header}>Create New Event</Text>
                    <Dropdown
                        data = {timeIntervals}
                        label = "Duration"
                        onChangeText = {(duration) => {
                            if(duration === ("1 hour")) {
                                this.setState({duration: 1});
                            } else if (duration === ("2 hours")) {
                                this.setState({duration: 2});
                            } else {
                                this.setState({duration: 3});
                            }
                        }}
                    />
                    <Dropdown
                        data = {sportsData}
                        label = "Sport"
                        onChangeText = {(sport) => this.setState({sport})}
                    />
                    <View style = {{height: 20}}></View>
                    <Text>Event Name</Text>
                    <TextInput
                        style = {styles.textinput}
                        placeholder = "Your event name"
                        onChangeText = {(eventName) => this.setState({eventName})}
                        maxLength = {28}
                        value = {this.state.eventName}
                     />
                    <Text>Event Description</Text>
                    <TextInput
                        style = {styles.textinputdescription}
                        placeholder = "Your event description"
                        multiline = {true}
                        numberOfLines = {3}
                        onChangeText = {(eventDescription) => this.setState({eventDescription})}
                        value = {this.state.eventDescription}
                    />
                    <Button color = "#ff8c00" title = "Post Event" onPress = {this.postEvent}/>
                </View >
            </KeyboardAvoidingView>
        );
    }


}

