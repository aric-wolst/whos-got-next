import React, { Component } from "react";
import { RefreshControl, SafeAreaView, ScrollView, FlatList, View } from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import ProfileBio from "../components/ProfileBio";
import Legend from "../components/Legend";
import data from "../components/Data";
import SportCell from "../components/SportCell"
import backendRequest from "../utils/RequestManager";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.initData = data;
        this.state = {
            refreshing: true,
            id: "default",
            firstName: "",
            lastName: "",
            email: "",
            birthday: "",
            description: "",
            sports: [],
            gender: "",
        };
        this.getData();
    }

    onRefresh() {
      this.setState({
        id: "default",
            firstName: "",
            lastName: "",
            email: "",
            birthday: "",
            description: "",
            sports: [],
            gender: "",
      });
      this.getData();
    }

    getData = () => {
      backendRequest("/users/" + this.props.id)
      .then (user => {
        this.setState({
          refreshing: false,
          id: this.props.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthday: user.birthday,
          description: user.description,
          sports: user.sports,
          gender: user.gender,
        });
      })
      .catch ( (error)  => {
        console.log(error);
      });

    }

    renderItem = ({item}) => {
      return (
        <SportCell sport = {item.sport} level = {item.level} />
      );
    }


    render() {
        return (
            <View>
                <ProfileHeader firstName = {this.state.firstName} birthday = {this.state.birthday} gender = {this.state.gender} />
                <ScrollView refreshControl = {<RefreshControl refreshing = {this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>} >
                    <ProfileBio description = {this.state.description} />
                    <Legend />
                    <SafeAreaView>
                        <FlatList
                            data = {this.state.sports}
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
