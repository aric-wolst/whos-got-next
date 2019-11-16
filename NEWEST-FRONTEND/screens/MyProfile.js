import React, { Component } from "react";
import { ActivityIndicator, AsyncStorage, Alert} from "react-native";
import backendRequest from "../utils/RequestManager";
import Profile from "./Profile";
import config from "../config";

class MyProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    getData() {
        AsyncStorage.getItem(config.userIdKey).then((userId) => {
            backendRequest("/users/" + userId).then ( (user) => {
                this.setState({
                    isLoading: false,
                    user: user
                });
            })
            .catch ( (error)  => { Alert.alert("Get data profile error",error.message);});
        });
    }

    componentDidMount() {
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
            return <Profile user = {this.state.user}/>;
        }
    }

}

export default MyProfile;
