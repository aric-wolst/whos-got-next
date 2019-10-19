import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text } from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileBio from '../components/ProfileBio';
import Legend from '../components/Legend';
import Data from '../components/Data';
import Constants from 'expo-constants';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.initData = Data;
        this.state = {
            data: this.initData
        };
    }

  
    renderItem = ({item}) => {
      return(
        <View style = {styles.sportList}>
            {item.volleyball[0] == 1 ? 
            <View style = {[styles.sportTab, {backgroundColor: 'tomato'}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/volleyball.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>Setter</Text>
              </View>
            </View>
            : null }
            {item.basketball[0] == 1 ? 
            <View style = {[styles.sportTab, {backgroundColor: 'yellow'}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/basketball.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>Point Guard</Text>
              </View>
            </View>
            : null }
            {item.football[0] == 1 ? 
            <View style = {[styles.sportTab, {backgroundColor: 'skyblue'}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/rugby.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>Wide Receiver</Text>
              </View>
            </View>
            : null }
            {item.soccer[0] == 1 ? 
            <View style = {[styles.sportTab, {backgroundColor: 'lightgreen'}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/football.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>Striker</Text>
              </View>
            </View>
            : null }
            {item.tennis[0] == 1 ? 
            <View style = {[styles.sportTab, {backgroundColor: 'yellow'}]} >
              <View style = {styles.logo}>
                <Image style = {styles.sportIcon} source={require('../img/tennis.png')} />
              </View>
              <View style = {styles.label}>
                <Text style = {styles.position}>Singles</Text>
              </View>
            </View>
            : null }
        </View>
      );
    }


    render() {
        return (
            <View>
                <ProfileHeader />
                <ScrollView>
                    <ProfileBio />
                    <Legend />
                    <SafeAreaView>
                        <FlatList
                            data = {this.state.data}
                            renderItem={this.renderItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </SafeAreaView>
                </ScrollView>
            </View>
        );
    }
}

export default Profile;

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