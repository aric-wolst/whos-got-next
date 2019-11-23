import React, { Component } from "react";
import { Button, ActivityIndicator, AsyncStorage, Alert} from "react-native";
import backendRequest from "../utils/RequestManager";
import Profile from "./Profile";
import config from "../config";

class MyProfile extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam("title"),
            headerRight: () => {
                if (navigation.getParam("hasUser")) {
                    return (
                        <Button onPress={navigation.getParam("toggleEditingProfile")} title={navigation.getParam("editButtonTitle")}/>
                    );
                }
            },
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isEditingProfile: false
        };
    }

    getData() {
        AsyncStorage.getItem(config.userIdKey).then((userId) => {
            backendRequest("/users/" + userId).then ( (user) => {
                this.props.navigation.setParams({
                    hasUser: true,
                    title: user.firstName
                });
                this.setState({
                    isLoading: false,
                    user
                });
            })
            .catch ( (error)  => { Alert.alert("Get data profile error",error.message);});
        });
    }

    _toggleEditingProfile = () => {
        this.props.navigation.setParams({editButtonTitle: (this.state.isEditingProfile) ? "Edit" : "Done"});
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
        if(this.state.isLoading) {
            return <ActivityIndicator />;
        } else {
            return <Profile user = {this.state.user} isEditingProfile = {this.state.isEditingProfile} />;
        }
    }

}

export default MyProfile;
