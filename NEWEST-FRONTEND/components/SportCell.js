import React, { Component } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import layout from "../utils/Layout";

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
        const colorLevels = [layout.color.beginner,layout.color.intermediate,layout.color.elite];
        let color = colorLevels[this.props.level - 1];

        const levels = ["Beginner", "Intermediate", "Elite"];
        const level = levels[this.props.level - 1];

        return (
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={layout.sportIcons[this.props.sport]} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>{level}</Text>
              </View>
            </View>
        );
    }

}


export default SportCell;
