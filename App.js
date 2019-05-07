import React from 'react';
import { StyleSheet, Button, TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
/* import GespeicherteScreen from './GespeicherteScreen'; */
import NeuesScreen from './NeuesScreen';
// import console = require('console');
import AnleitungKameraScreen from './AnleitungKameraScreen';
import AnleitungGalleryScreen from './AnleitungGalleryScreen';
import VolumenScreen from './VolumenScreen';

global.globalDirName = '';//in der Variablen wird der Barcode des aktuellen Projekts gespeichert

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  
  render() {
    
    return (
      <View style={styles.button}>
        <Button
          title="Neues Projekt"
          onPress={() => this.props.navigation.navigate('NeuesProjekt') }
        />
        <Button
          title="Berechnete Volumen"
          onPress={() => this.props.navigation.navigate('Volumen')}
          />
      </View>
    );
  }
}  

class AnleitungsScreen extends React.Component {
  static navigationOptions = {
    title: 'Anleitung',
  };
  render() {
    return (
      // <View style={styles.toggleButton} onPress={alert('huhu')}>
      //   <TouchableOpacity>
      //     <Text>Hallo</Text>
      //   </TouchableOpacity>
      // </View>
      <View style={styles.button}>
        <Button
          title="Kamera"
          onPress={() => this.props.navigation.navigate('Kamera')}
        />
        <Button
          title="Galerie"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={ styles.screen }>
        <Text>Details!</Text>
      </View>
    );
  }
}

// class TestScreen extends React.Component {
//   render() {
//     return (
//       <View style={ styles.screen }>
//         <Text>Test!</Text>
//       </View>
//     )
//   }
// }

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen }, 
  Details: { screen: DetailsScreen },
  NeuesProjekt: { 
    screen: () => <NeuesScreen/>, 
    navigationOptions:{
      header: null,
      tabBarVisible:false,
    }  
  }, /* 
  GespeicherteProjekte: { screen: GespeicherteProjekteScreen},  */
  // GespeicherteProjekte: { 
  //   screen:() => <GespeicherteScreen/>,
  //   navigationOptions:{
  //     title: 'Gespeicherte Projekte', 
  //   } 
  // },
  Volumen: {
    screen: () => <VolumenScreen/>,
    navigationOptions: {
      title: 'Berechnete Volumen'
    }
  },
});

const AnleitungsStack = createStackNavigator({
  Anleitung: { 
    screen: AnleitungsScreen 
  },
  Details: { 
    screen: () => <AnleitungGalleryScreen/>,
    navigationOptions:{
      title: 'Galerie'
    }
  },
  Kamera: { 
    screen: () => <AnleitungKameraScreen/>, 
    navigationOptions: {
      title: 'Kamera',
    }   
  },
});

export default createAppContainer(createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Anleitung: { screen: AnleitungsStack },
    // Anleitung: { screen: () => <AnleitungScreen/> },
   // NeuesProjekt : { screen: NeuesStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName ="home";
        } else if (routeName === 'Anleitung') {
          iconName = 'book-open-variant';
        }
        return <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />;
      }, 
    }),
  }
));

const styles = StyleSheet.create({
  screen: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 10,
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

