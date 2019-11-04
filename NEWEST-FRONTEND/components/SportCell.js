import React, { Component } from "react";
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from "react-native";
import GLOBALS from "../utils/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sportTab: {
    flexDirection: "row",
    marginVertical: 2,
    marginHorizontal: 10,
    flex: 1,
    borderWidth: 0,
    borderColor: "rgba(0,0,0,0.4)",
    borderRadius: 10
  },
  sportIcon: {
    height: 60,
    width: 60,
    margin: 5
  },
  position: {
    fontSize: 36,
  },
  level: {
    fontSize: 12,
    fontStyle: "italic"
  },
  logo: {
    flex: 1,
    flexDirection: "row"
  },
  label: {
    flex: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

class SportCell extends Component {
    

    render () {
        let imageUrl = "";
        if(this.props.sport === "volleyball") {
            imageUrl = "../img/volleyball.png";
        } else if (this.props.sport ==="basketball") {
            imageUrl = "../img/basketball.png";
        } else if (this.props.sport === "badminton") {
            imageUrl = "../img/shuttlecock.png";
        } else if (this.props.sport === "baseball") {
            imageUrl = "../img/baseball.png";
        } else if (this.props.sport === "football") {
            imageUrl = "../img/rugby.png";
        } else if (this.props.sport === "hockey") {
            imageUrl = "../img/puck.png";
        } else if (this.props.sport === "soccer") {
            imageUrl = "../img/football.png";
        } else if (this.props.sport === "streetfighting") {
            imageUrl = "../img/brass-knuckles.png";
        } else if (this.props.sport === "tennis") {
            imageUrl = "../img/tennis.png";
        } else {
            imageUrl = "../img/logo.png";
        }

        let color = "";
        let level = "";
        if(this.props.level === 1) {
            color = GLOBALS.COLOR.BEGINNER;
            level = "Beginner";
        } else if (this.props.level === 2) {
            color = GLOBALS.COLOR.INTERMEDIATE;
            level = "Intermediate";
        } else if (this.props.level === 3) {
            color = GLOBALS.COLOR.ELITE;
            level = "Elite";
        } else {
            color = GLOBALS.COLOR.ELITE;
        }

        return (
            <View style = {styles.sportList}>
            {this.props.sport == "volleyball" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/volleyball.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "basketball" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/basketball.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "football" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/rugby.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "soccer" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/football.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "tennis" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/tennis.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "streetfighting" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/brass-knuckles.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null 
            }
            {this.props.sport == "baseball" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/baseball.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "hockey" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/puck.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
            {this.props.sport == "badminton" ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require("../img/shuttlecock.png")} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
            : null }
        </View>
        );
    }

}


export default SportCell;