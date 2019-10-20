import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text, ActivityIndicator, TouchableOpacity, ListView } from 'react-native';
import FindTeamsHeader from '../components/FindTeamsHeader';
import { createStackNavigator } from 'react-navigation-stack';

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          dataSource: null,
         };
    }

    componentDidMount(){
        fetch("http://34.220.132.159/events/nearby?longitude=-123.252343&latitude=49.262452", {
            method: "GET",
        })
        .then(response => response.json())
        .then((responseJson)=> {
          this.setState({
           loading: false,
           dataSource: responseJson
          })
          console.log(responseJson);
          console.log(responseJson.firstName);
        })
        .catch(error=>console.log(error)) 
    }
    
    FlatListItemSeparator = () => {
        return (
          <View style={{
             height: 0.5,
             width:"100%",
             backgroundColor:"rgba(0,0,0,0.5)",
        }}
        />
        );
    }

    goToTeam = async () => {

    }
        
    renderItem=(data)=>
    <View style = {{flexDirection: 'row'}}>
        <View style = {{height: 100, width: '80%'}}>
            <Text style={styles.sport}>{data.item.sport}</Text>
            <Text style={styles.date}>{data.item.date}</Text>
            <Text style={styles.location}>Location: {data.item.location.coordinates}</Text>
        </View>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('TeamProfile', {
            teamName: data.item.name,
            sport: data.item.username,
            location: data.item.address.city,
            level: data.item.address.zipcode,
            league: data.item.company.name,
            numPlayersNeeded: data.item.address.geo.lat,
            teamBio: data.item.company.catchPhrase
        })}}>
            <View style = {{height: 100, justifyContent: 'center', width: '20%'}}>
                <View style = {styles.info}>
                    <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 30}}>i</Text>
                </View>
            </View>
        </TouchableOpacity>
    </View>
    
    render() {
        if(this.state.loading){
            return( 
              <View style={styles.loader}> 
                <ActivityIndicator size="large" color="black"/>
              </View>
        )}

        return(
            <View>
                <ScrollView>
                    <FindTeamsHeader />
                    <View style={styles.container}>
                        {<FlatList
                            data= {this.state.dataSource}
                            ItemSeparatorComponent = {this.FlatListItemSeparator}
                            renderItem= {item=> this.renderItem(item)}
                        /> }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Teams;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff"
     },
    loader:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff"
     },
    list:{
      paddingVertical: 4,
      margin: 5,
      backgroundColor: "#fff"
     },
    date:{
        fontSize: 20,
        marginTop: 3,
        marginLeft: 3
    },
    location:{
        fontSize: 15,
        marginBottom: 8,
        marginTop: 3,
        marginLeft: 3
    },
    sport:{
        fontWeight: "bold",
        fontSize: 25,
        marginTop: 8,
        marginLeft: 3
    },
    info:{
        width: 50, 
        height: 50, 
        borderRadius: 50/2, 
        backgroundColor: '#ff8c00', 
        padding: 5, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
  });

