import React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Table, Row, Rows } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class VolumenScreen extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
    }

    componentDidMount(){
        return fetch('http://139.30.111.203:3000/')
          .then((response) => response.json())
          .then((responseJson) => {
    
            this.setState({
              isLoading: false,
              // dataSource: responseJson,
              dataSource: responseJson.volumen,
            }, function(){
    
            });
          })
          .catch((error) =>{
            console.error(error);
          });
    }

    render () {
      if(this.state.isLoading){
        return(
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
          </View>
        )
      }
      const state = this.state;
      return(
        <ScrollView>
          <View style={styles.screen}>
            <Text style={{fontSize: 17}}>Barcode            Datum    Volumen</Text>
            <FlatList style={{paddingTop: 20}} 
              data={this.state.dataSource}
              renderItem={({item}) =>  <Text>{item.barcode}   {item.date}   {item.vol} l</Text>}
              keyExtractor={({barcode}, index) => barcode}
            />
          </View>
        </ScrollView>
      )
    }

}

const styles = StyleSheet.create({
  screen: {
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
    padding: 20,
  }, 
})

