import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, Button, FlatList, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import FindTeamsHeader from '../components/FindTeamsHeader';

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          dataSource:[]
         };
    }

    componentDidMount(){
        fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then((responseJson)=> {
          this.setState({
           loading: false,
           dataSource: responseJson
          })
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
        
    renderItem=(data)=>
    <View>
        <Text style={styles.teamname}>{data.item.name}</Text>
        <Text style={styles.sport}>Sport: {data.item.username}</Text>
        <Text style={styles.location}>Location: {data.item.address.city}</Text>
    </View>
    
    render() {
        if(this.state.loading){
            return( 
              <View style={styles.loader}> 
                <ActivityIndicator size="large" color="#0c9"/>
              </View>
        )}

        return(
            <View>
                <ScrollView>
                    <FindTeamsHeader />
                    <View style={styles.container}>
                        <FlatList
                            data= {this.state.dataSource}
                            ItemSeparatorComponent = {this.FlatListItemSeparator}
                            renderItem= {item=> this.renderItem(item)}
                            keyExtractor= {item=>item.id.toString()}
                        />
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
    teamname:{
        fontWeight: "bold",
        fontSize: 25,
        marginTop: 8,
        marginLeft: 3
    },
    location:{
        fontSize: 15,
        marginBottom: 8,
        marginTop: 3,
        marginLeft: 3
    },
    sport:{
        fontSize: 20,
        marginTop: 3,
        marginLeft: 3
    }
  });
  