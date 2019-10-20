import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from 'react-native';


class SportCell extends Component {
    

    render () {
        let imageUrl = '';
        if(this.props.sport = "volleyball") {
            imageUrl = '../img/volleyball.png';
        } else{
            imageUrl = '../img/basketball.png';
        }

        let color = '';
        if(this.props.level === 1) {
            color = 'yellow';
        } else if (this.props.level === 2) {
            color = 'lightgreen';
        } else if (this.props.level === 3) {
            color = 'skyblue';
        } else if (this.props.level === 4) {
            color = 'tomato';
        } else {
            color = 'orange';
        }

        return (
            <View style = {styles.sportList}>
            {this.props.sport == 'volleyball' ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/volleyball.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>POSITION</Text>
              </View>
            </View>
            : null }
            {this.props.sport == 'basketball' ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/basketball.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>POSITION</Text>
              </View>
            </View>
            : null }
            {this.props.sport == 'football' ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/rugby.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>POSITION</Text>
              </View>
            </View>
            : null }
            {this.props.sport == 'soccer' ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/football.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>POSITION</Text>
              </View>
            </View>
            : null }
            {this.props.sport == 'tennis' ? 
            <View style = {[styles.sportTab, {backgroundColor: color}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/tennis.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>POSITION</Text>
              </View>
            </View>
            : null }
        </View>
        );
    }

}


export default SportCell;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sportTab: {
      flexDirection: 'row',
      marginVertical: 2,
      marginHorizontal: 10,
      flex: 1,
      borderWidth: 0,
      borderColor: 'rgba(0,0,0,0.4)',
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
      fontStyle: 'italic'
    },
    logo: {
      flex: 1,
      flexDirection: 'row'
    },
    label: {
      flex: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  });