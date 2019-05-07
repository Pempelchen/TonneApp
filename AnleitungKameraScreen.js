import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Foundation} from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';


export default class KameraScreen extends React.Component {
  render() {
    return (
      <ScrollView>
        <View style={ styles.screen }>
          {/* <Text style={ styles.title }>
            Einstellungen
          </Text> */}
          <Text style={styles.title}>
            Kopfleiste
          </Text>
          <Image style={styles.image} source={require('./assets/kopfleiste.png')}/>
          <View style={styles.table}>
            <View style={{flexDirection:'row'}}>
              <MaterialIcons style={styles.icon} name="flash-on" size={32}/>
              <Text style={styles.text}>
                Durch Tippen auf das Symbol lässt sich der Blitz an <MaterialIcons name="flash-on" size={20}/>, aus <MaterialIcons name="flash-off" size={20}/> 
                und Taschenlampe anschalten
                <MaterialIcons name="highlight" size={20}/>.
              </Text>
            </View> 
            <View style={{flexDirection:'row'}}>
              <Text style={{width:50, padding: 10, fontSize:25}} >0</Text>
              <Text style={styles.text} >Anzahl der aufgenommenen Bilder.</Text>
            </View>
          <Text style={styles.title}>
            Fußleiste
          </Text>
          <Image style={styles.image} source={require('./assets/fussleiste.png')}/>
          <View style={styles.table}>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons style={styles.icon} name="barcode-scan" size={30}/>
              <Text style={styles.text}>
                Bevor Bilder aufgenommen werden können, muss der Barcode der Tonne gescannt werden.
                Der Barcode ist zur Zuordnug der Bilder zu der Tonne nötig und wird deshalb im Dateinamen jedes Bildes gespeichert.
                Dazu ist Barcode scannen aktiviert (<MaterialCommunityIcons name="barcode-scan" size={20}/>, weiß), bis ein Barcode erkannt wurde.
                Dann wird Barcode scannen deaktiviert (<MaterialCommunityIcons name="barcode-scan" color={"#858585"} size={20}/>, grau) und es können Bilder aufgenommen werden.
              </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Ionicons style={styles.icon} name="ios-radio-button-on" size={30} />
              <Text style={styles.text}>
                Sobald ein Barcode erkannt wurde, können durch Tippen auf das Symbol Bilder aufgenommen werden. 
              </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'column'}}>
                <Foundation style={styles.icon} name="thumbnails" size={30} />
                <Foundation style={styles.icon} name="thumbnails" size={30} /><View style={styles.newPhotosDot}></View>
              </View>
              <Text style={styles.text}>
                Durch Tippen auf das Symbol wird in die Gallerieansicht navigiert.
                Ein blauer Punkt zeigt an, ob neue Bilder aufgenommen wurden.
                In der Gallerieansicht sind alle aufgenommenen Bilder zu sehen, außerdem können Bilder hochgeladen, gelöscht oder gespeichert werden.
              </Text>
            </View>
          </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-between'
  },
  screen: {
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: '#007AFF',
  },
  // subtitle: {
  //   fontSize: 20,
  //   // color: 'grey',
  // },
  table: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width:300, 
    height:60,
  },
  text: {
    width: 250, 
    padding: 10,
    fontSize: 15,
  },
  icon: {
    width:50, 
    padding: 10,
  },
  newPhotosDot: {
    position: 'absolute',
    top: 61,
    left: 26,
    width: 8,
    height: 8,
    borderRadius: 4, 
    backgroundColor: '#007AFF',
  },
})