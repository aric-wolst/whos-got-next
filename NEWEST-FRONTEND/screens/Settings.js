import React, { Component } from 'react';
import { TextInput, KeyboardAvoidingView, Alert, AsyncStorage, Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import backendRequest from "../utils/RequestManager";
import config from '../config';



class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            gender: '',
            description: '',
            badminton: [false,'Beginner'],
            baseball: [false,'Beginner'],
            basketball: [false,'Beginner'],
            football: [false,'Beginner'],
            hockey:[false,'Beginner'],
            soccer:[false,'Beginner'],
            streetfighting: [false,'Beginner'],
            tennis: [false,'Beginner'],
            volleyball: [false,'Beginner'],
        }
        this.updateProfile=this.updateProfile.bind(this);
        this.addBadminton=this.addBadminton.bind(this);
        this.addBaseball=this.addBaseball.bind(this);
        this.addBasketball=this.addBasketball.bind(this);
        this.addFootball=this.addFootball.bind(this);
        this.addHockey=this.addHockey.bind(this);
        this.addSoccer=this.addSoccer.bind(this);
        this.addStreetFighting=this.addStreetFighting.bind(this);
        this.addTennis=this.addTennis.bind(this);
        this.addVolleyball=this.addVolleyball.bind(this);
    }

    updateProfile = async () => {
        //console.log(this.state);
        var sports = new Array();
        var obj;
        var level;

        if(this.state.badminton[0] === true) {
            if(this.state.badminton[1] === 'Beginner') {
                level = 1;
            } else if (this.state.badminton[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "badminton", level: level};
            sports.push(obj);
        }

        if(this.state.baseball[0] === true) {
            if(this.state.baseball[1] === 'Beginner') {
                level = 1;
            } else if (this.state.baseball[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "baseball", level: level};
            sports.push(obj);
        }

        if(this.state.basketball[0] === true) {
            if(this.state.basketball[1] === 'Beginner') {
                level = 1;
            } else if (this.state.basketball[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "basketball", level: level};
            sports.push(obj);
        }

        if(this.state.football[0] === true) {
            if(this.state.football[1] === 'Beginner') {
                level = 1;
            } else if (this.state.football[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "football", level: level};
            sports.push(obj);
        }

        if(this.state.hockey[0] === true) {
            if(this.state.hockey[1] === 'Beginner') {
                level = 1;
            } else if (this.state.hockey[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "hockey", level: level};
            sports.push(obj);
        }

        if(this.state.soccer[0] === true) {
            if(this.state.soccer[1] === 'Beginner') {
                level = 1;
            } else if (this.state.soccer[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "soccer", level: level};
            sports.push(obj);
        }

        if(this.state.streetfighting[0] === true) {
            if(this.state.streetfighting[1] === 'Beginner') {
                level = 1;
            } else if (this.state.streetfighting[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "streetfighting", level: level};
            sports.push(obj);
        }

        if(this.state.tennis[0] === true) {
            if(this.state.tennis[1] === 'Beginner') {
                level = 1;
            } else if (this.state.tennis[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "tennis", level: level};
            sports.push(obj);
        }

        if(this.state.volleyball[0] === true) {
            if(this.state.volleyball[1] === 'Beginner') {
                level = 1;
            } else if (this.state.volleyball[1] === 'Intermmediate') {
                level = 2;
            } else {
                level = 3;
            }
            obj = {sport: "volleyball", level: level};
            sports.push(obj);
        }
        
        AsyncStorage.getItem(config.userIdKey)
        .then((id) => {
            backendRequest('/users/' + id, {}, 'PUT', {
                "firstName": this.state.firstName,
                "gender": this.state.gender,
                "description": this.state.description,
                "sports": sports,    
            }).then ( () => {
                Alert.alert('Success', 'Your profile has been updated!');
                this.setState({
                    badminton: [false,'Beginner'],
                    baseball: [false,'Beginner'],
                    basketball: [false,'Beginner'],
                    football: [false,'Beginner'],
                    hockey:[false,'Beginner'],
                    soccer:[false,'Beginner'],
                    streetfighting: [false,'Beginner'],
                    tennis: [false,'Beginner'],
                    volleyball: [false,'Beginner'],
                });
                this.props.navigation.navigate('MyProfile');
            })
            .catch( (err) => console.log(err));
        })
        .catch ( (err) => console.log(err));

    }

    signOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }


    addBadminton() {
        this.setState({
            badminton: [true,this.state.badminton[1]],
        })
    }
    addBaseball() {
        this.setState({
            baseball: [true,this.state.baseball[1]],
        })
    }
    addBasketball() {
        this.setState({
            basketball: [true,this.state.basketball[1]],
        })
    }
    addFootball() {
        this.setState({
            football: [true,this.state.football[1]],
        })
    }
    addHockey() {
        this.setState({
            hockey: [true,this.state.hockey[1]],
        })
    }
    addSoccer() {
        this.setState({
            soccer: [true,this.state.soccer[1]],
        })
    }
    addStreetFighting() {
        this.setState({
            streetfighting: [true,this.state.streetfighting[1]],
        })
    }
    addTennis() {
        this.setState({
            tennis: [true,this.state.tennis[1]],
        })
    }
    addVolleyball() {
        this.setState({
            volleyball: [true,this.state.volleyball[1]],
        })
    }

    render() {
        let levels = [{  
            value: 'Beginner',
        }, {
            value: 'Intermmediate',
        }, {
            value: 'Expert',
        }];
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior = "padding" enabled>
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <Text style = {styles.header}>Edit Your Profile</Text>
                        <View style = {{height: 20}}/>
                        <Text>Name</Text>
                        <TextInput
                            style = {styles.textinput} 
                            placeholder = "Your full name"
                            onChangeText = {(firstName) => this.setState({firstName})}
                            value = {this.state.firstName}
                        />
                        <Text>Gender</Text>
                        <TextInput
                            style = {styles.textinput} 
                            placeholder = "What do you identify as?"
                            onChangeText = {(gender) => this.setState({gender})}
                            value = {this.state.gender}
                        />
                        <Text>Bio</Text>
                        <TextInput 
                            style = {styles.textinputdescription} 
                            placeholder = "A bit about yourself" 
                            multiline = {true} 
                            numberOfLines = {3}
                            onChangeText = {(description) => this.setState({description})}
                            value = {this.state.description}
                        />

                        <Text>Sports</Text>
                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>BADMINTON</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    badminton: [this.state.badminton[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.badminton[0]} 
                                title = "Add" 
                                onPress = {this.addBadminton}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>BASEBALL</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    baseball: [this.state.baseball[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.baseball[0]} 
                                title = "Add" 
                                onPress = {this.addBaseball}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>BASKETBALL</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    basketball: [this.state.basketball[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.basketball[0]} 
                                title = "Add" 
                                onPress = {this.addBasketball}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>FOOTBALL</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    football: [this.state.football[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.football[0]} 
                                title = "Add" 
                                onPress = {this.addFootball}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>HOCKEY</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    hockey: [this.state.hockey[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.hockey[0]} 
                                title = "Add" 
                                onPress = {this.addHockey}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>SOCCER</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    soccer: [this.state.soccer[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.soccer[0]} 
                                title = "Add" 
                                onPress = {this.addSoccer}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>STREET FIGHTING</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    streetfighting: [this.state.streetfighting[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.streetfighting[0]} 
                                title = "Add" 
                                onPress = {this.addStreetFighting}
                            />
                        </View>

                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>TENNIS</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    tennis: [this.state.tennis[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.tennis[0]} 
                                title = "Add" 
                                onPress = {this.addTennis}
                            />
                        </View>
                        
                        <View style = {styles.sportCard}>
                            <Text style = {styles.sportname}>VOLLEYBALL</Text>
                            <Dropdown 
                                data = {levels}
                                label = "Level"
                                onChangeText = {(level) => this.setState({
                                    volleyball: [this.state.volleyball[0],level]
                                })}
                            />
                            <Button 
                                disabled = {this.state.volleyball[0]} 
                                title = "Add" 
                                onPress = {this.addVolleyball}
                            />
                        </View>

                        <View style = {{height: 20}}/>
                        <Button color = '#ff8c00' title = 'Update Profile' onPress = {this.updateProfile}/>
                        <View style = {{height: 10}}/>
                        <Button color = 'grey' title = 'Sign Out' onPress = {this.signOut}/>
                    </ScrollView>
                </SafeAreaView >
            </KeyboardAvoidingView>
        );
    }
}

export default Settings;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        justifyContent: 'center',
        paddingLeft: 40,
        paddingRight: 40,
    },
    form: {
        alignSelf: 'stretch',
    },
    header: {
        fontSize: 24,
        paddingBottom: 10,
        borderBottomColor: '#ff8c00',
        borderBottomWidth: 3,
    },
    textinput: {
        alignSelf: 'stretch',
        height: 40,
        marginTop: 5,
        marginBottom: 20,
        borderColor: '#ff8c00',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    textinputdescription: {
        alignSelf: 'stretch',
        height: 100,
        marginTop: 5,
        marginBottom: 20,
        borderColor: '#ff8c00',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    sportname: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sportCard: {
        margin: 5,
        borderColor: '#ff8c00',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    }
});