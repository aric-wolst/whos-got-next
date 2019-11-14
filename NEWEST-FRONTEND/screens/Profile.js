import React, { Component } from "react";
import {SafeAreaView, ScrollView, FlatList, View} from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import ProfileBio from "../components/ProfileBio";
import Legend from "../components/Legend";
import SportCell from "../components/SportCell";

class Profile extends Component {

    constructor(props) {
        super(props);
    }

    renderItem = ({item}) => {
      return (
        <SportCell sport = {item.sport} level = {item.level} />
      );
    }

    render() {
        const user = this.props.user;
        return (
            <View>
                <ProfileHeader firstName = {user.firstName} birthday = {user.birthday} gender = {user.gender} />
                <ScrollView>
                    <ProfileBio description = {user.description} />
                    <Legend />
                    <SafeAreaView>
                        <FlatList
                            data = {user.sports}
                            renderItem={this.renderItem}
                            keyExtractor={(item) => item.sport}
                        />
                    </SafeAreaView>
                </ScrollView>
            </View>
        );
    }
}

export default Profile;
