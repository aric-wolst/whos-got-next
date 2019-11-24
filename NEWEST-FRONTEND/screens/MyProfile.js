import React, { Component } from "react";
import { Button, ActivityIndicator, AsyncStorage, Alert, View, StyleSheet, ScrollView, Text } from "react-native";
import backendRequest from "../utils/RequestManager";
import { Dropdown } from "react-native-material-dropdown";
import layout from "../utils/Layout";
import Profile from "./Profile";
import config from "../config";

const styles = StyleSheet.create({
    sportCard: {
        margin: 10,
        borderColor: "#ff8c00",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    manageSports: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20
    },
});

class MyProfile extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam("title"),
            headerRight: () => {
                if (navigation.getParam("hasUser")) {
                    return (
                        <View style = {{marginRight: 10}}>
                            <Button color = {layout.color.mainColor} onPress={navigation.getParam("toggleEditingProfile")} title={navigation.getParam("editButtonTitle")}/>
                        </View>
                    );
                }
            },
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isEditingProfile: false,
            sport: "",
            level: 0,
        };
    }

    signOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate("Auth");
    }

    getData() {
        AsyncStorage.getItem(config.userIdKey).then((userId) => {
            backendRequest("/users/" + userId).then ( (user) => {
                this.props.navigation.setParams({
                    hasUser: true,
                    title: "My Profile",
                });
                this.setState({
                    isLoading: false,
                    user,
                });
            })
            .catch ( (error)  => { Alert.alert("Get data profile error",error.message);});
        });
    }

    removeSport = () => {
        if(this.state.sport === "") {
            Alert.alert("Invalid Entry", "Please fill in the Sport field.")
        } else {
            AsyncStorage.getItem(config.userIdKey)
            .then((id) => {
                let tempUser = {...this.state.user};
                var i;
                var sportExists = 0;
                var arrayLength = tempUser.sports.length;
                for(i = 0; i < arrayLength; i++) {
                    if(tempUser.sports[i].sport === this.state.sport) {
                        sportExists = 1;
                        break;
                    }
                }
                if(sportExists) {
                    tempUser.sports.splice(i,1);
                    backendRequest("/users/" + id, {}, "PUT", {
                        "sports": tempUser.sports,
                    }).then ( (savedUser) => {
                        this.setState({
                            user: savedUser,
                        });
                    })
                    .catch( (err) => Alert.alert("User Info Error", err.message));
                } else {
                    Alert.alert("Error", "Sport does not exist in your profile.");
                }
            })
        }
    }

    addSport = () => {
        if(this.state.sport === "" || this.state.level === 0 ) {
            Alert.alert("Invalid Entry", "Please fill in the Sport/Level fields.")
        } else {
            AsyncStorage.getItem(config.userIdKey)
            .then((id) => {
                let tempUser = {...this.state.user};
                var i;
                var sportExists = 0;
                var sameLevel = 0;
                var arrayLength = tempUser.sports.length;
                for (i = 0; i < arrayLength; i++) {
                    if(tempUser.sports[i].sport === this.state.sport) {
                        sportExists = 1;
                        if(tempUser.sports[i].level === this.state.level) {
                            sameLevel = 1;
                            break;
                        }
                        break;
                    }
                }
                if(sportExists && sameLevel) {
                    Alert.alert("Error","Sport/Level already exists on your profile.");
                } else if( sportExists ) {
                    tempUser.sports[i].level = this.state.level;
                    backendRequest("/users/" + id, {}, "PUT", {
                        "sports": tempUser.sports,
                    }).then ( (savedUser) => {
                        this.setState({
                            user: savedUser,
                        });
                    })
                    .catch( (err) => Alert.alert("User Info Error", err.message));
                } else {
                    var obj = {sport: this.state.sport, level: this.state.level};
                    tempUser.sports.push(obj);
                    backendRequest("/users/" + id, {}, "PUT", {
                        "sports": tempUser.sports,
                    }).then ( (savedUser) => {
                        this.setState({
                            user: savedUser,
                        });
                    })
                    .catch( (err) => Alert.alert("User Info Error", err.message));
                }
            })
            .catch ( (err) => Alert.alert("User ID Error", err.message));
        }
    }

    _toggleEditingProfile = () => {
        this.props.navigation.setParams({editButtonTitle: (this.state.isEditingProfile) ? "Edit" : "Done"});
        if (this.state.isEditingProfile) {
            if(this.state.user.firstName != this.userProfile.header.state.firstName || this.state.user.gender != this.userProfile.header.state.gender
                || this.state.user.description != this.userProfile.bio.state.description ) {
                AsyncStorage.getItem(config.userIdKey)
                .then((id) => {
                    backendRequest("/users/" + id, {}, "PUT", {
                        "firstName": this.userProfile.header.state.firstName,
                        "gender": this.userProfile.header.state.gender,
                        "description": this.userProfile.bio.state.description,
                    }).then ( () => {
                        let tempUser = this.state.user;
                        tempUser.firstName = this.userProfile.header.state.firstName;
                        tempUser.gender = this.userProfile.header.state.gender;
                        tempUser.description = this.userProfile.bio.state.description;
                        this.setState({
                            user: tempUser,
                        });
                        Alert.alert("Success", "Your profile has been updated!");
                    })
                    .catch( (err) => Alert.alert("User Info Error", err.message));
                })
                .catch ( (err) => Alert.alert("User ID Error", err.message));
            }
        }
        this.setState({ isEditingProfile: !this.state.isEditingProfile });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            hasUser: (this.state.user) ? true : false,
            editButtonTitle: "Edit",
            toggleEditingProfile: this._toggleEditingProfile
        });

        if (this.state.user) {
            this.setState({
                isLoading: false
            });
        }

        this.focusSubscription = this.props.navigation.addListener("willFocus", (() => {
            this.getData();
        }));
    }

    componentWillUnmount() {
        this.focusSubscription.remove();
    }

    render() {

        let levels = [{
            value: "Beginner",
        }, {
            value: "Intermediate",
        }, {
            value: "Elite",
        }];

        let sports = [{
            value: "Badminton",
        }, {
            value: "Baseball",
        }, {
            value: "Basketball",
        }, {
            value: "Football",
        }, {
            value: "Hockey",
        }, {
            value: "Soccer",
        }, {
            value: "Streetfighting",
        }, {
            value: "Tennis",
        }, {
            value: "Volleyball",
        }];

        if(this.state.isLoading) {
            return <ActivityIndicator />;
        } else {
            return(
                <ScrollView>
                    <Profile ref = {(userProfile) => {this.userProfile = userProfile;}} user = {this.state.user} isEditingProfile = {this.state.isEditingProfile} />
                    {this.state.isEditingProfile &&
                        <View>
                            <View style = {styles.sportCard}>
                                <Text style = {styles.manageSports}>MANAGE YOUR SPORTS</Text>
                                <Dropdown
                                    data = {sports}
                                    label = "Sport"
                                    onChangeText = { (sport) => this.setState({
                                        sport: sport.toLowerCase(),
                                    })}
                                />
                                <Dropdown
                                    data = {levels}
                                    label = "Level"
                                    onChangeText = { (level) => {
                                        var levelNo;
                                        if(level === "Beginner") {
                                            levelNo = 1;
                                        } else if (level === "Intermediate") {
                                            levelNo = 2;
                                        } else {
                                            levelNo = 3;
                                        }
                                        this.setState({level: levelNo});
                                    }}
                                />
                                <View style = {{flexDirection: "row", justifyContent: "center", flex: 1}}>
                                    <View style = {{flex: 1, margin: 10}}>
                                        <Button
                                            color = {layout.color.mainColor}
                                            style = {styles.button}
                                            title = "Add"
                                            onPress = { () => { this.addSport(); } }
                                        />
                                    </View>
                                    <View style = {{flex: 1, margin: 10}}>
                                        <Button
                                            color = "grey"
                                            style = {styles.button}
                                            title = "Remove"
                                            onPress = { () => { this.removeSport(); } }
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    <View style = {{margin: 10}}>
                        <Button color = "grey" title = "Sign Out" onPress = { () => { this.signOut(); } } />
                    </View>
                </ScrollView>
            );
        }
    }

}

export default MyProfile;
