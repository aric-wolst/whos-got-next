import React, { Component } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import Profile from "./Profile";

class PublicPlayerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const user = navigation.getParam("user");
        this.setState({
            isLoading: false,
            user
        });
    }

    render() {
        if(this.state.isLoading) {
            return <ActivityIndicator />;
        } else {
            return(
                <ScrollView>
                    <Profile user = {this.state.user} isEditingProfile = {false} />
                </ScrollView>
            );
        }
    }
}

export default PublicPlayerProfile;
