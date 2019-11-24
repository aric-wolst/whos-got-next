import React, { Component } from "react";
import {SafeAreaView, ScrollView, FlatList, View, Button} from "react-native";
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
        <SportCell sport = {item.sport} level = {item.level}/>
      );
    }

    render() {
        const user = this.props.user;
        const isEditingProfile = this.props.isEditingProfile;
        return (
            <View>
                <ProfileHeader authentication = {user.authentication} ref = {(header) => {this.header = header;}} firstName = {user.firstName} birthday = {user.birthday} gender = {user.gender} isEditingProfile = {isEditingProfile}/>
                <ScrollView>
                    <ProfileBio ref = {(bio) => {this.bio = bio;}} description = {user.description} isEditingProfile = {isEditingProfile} />
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
