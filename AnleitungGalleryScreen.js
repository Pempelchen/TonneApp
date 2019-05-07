import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Octicons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';


export default class GalleryScreen extends React.Component { 
    render() {
    
      return (
        <ScrollView>
          <View style={ styles.screen }>
            {/* <View style={{flexDirection:'row'}}>
              <Ionicons style={styles.icon} name="md-checkmark-circle" size={30} color='#007AFF'/>
              <Text style={styles.text}>
                Alle Bilder auswählen bzw. abwählen.
              </Text>
            </View> */}
            {/* <Text style={ styles.title }>
              Einstellungen
            </Text> */}
            <Text style={styles.title}>
              Kopfleiste
            </Text>
            <Image style={styles.image} source={require('./assets/kopfleiste_gallerie.png')}/>
            <View style={styles.table}>
              <View style={{flexDirection:'row'}}>
                <MaterialIcons style={styles.icon} name="arrow-back" size={30}/>
                <Text style={styles.text}>
                  Navigiert zurück zur Kameraansicht.
                </Text>
              </View>
              {/* <View style={{flexDirection:'row'}}>
                <MaterialIcons  style={styles.icon} name="save" size={30}/>
                <Text style={styles.text}>
                  Ausgewählte Bilder werden im internen Speicher gespeichert. 
                  Wichtig nur, wenn das Hochladen nicht funktioniert.
                </Text>
              </View>  */}
              <View style={{flexDirection: 'row'}}>
                <Ionicons style={styles.icon} name="md-checkmark-circle" size={30} />
                <Text style={styles.text}>
                  Alle Bilder auswählen bzw. abwählen.
                </Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <MaterialIcons style={styles.icon} name="file-upload" size={30}/>
                <Text style={styles.text} >
                  Lädt die ausgewählten Bilder auf den Server. 
                  Nach dem Hochladen können weitere Bilder aufgenommen und/oder hochgeladen werden, oder ein neuesProjekt begonnen werden.
                  Beim Starten eines neuen Projekts werden alle aktuellen Bilder gelöscht.
                </Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Octicons style={{width:50, padding: 20}} name="kebab-vertical" size={25}/>
                <View style={{flexDirection:'column'}}>
                  <Text style={styles.text}>
                    Weitere Optionen.
                  </Text>
                  <View style={{flexDirection:'row'}}>
                    <MaterialIcons style={styles.icons} name="delete" size={25}/>
                    <Text style={styles.text}>
                      Ausgewählte Bilder löschen.
                    </Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Ionicons style={styles.icons} name="md-close-circle" size={25}/>
                    <Text style={styles.text}>
                      Abbrechen, dabei werden die aktuellen Bilder und der Barcode gelöscht. Um neue Bilder aufnehmen zu können muss erst wieder ein Barcode gescannt werden.
                    </Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <MaterialIcons  style={styles.icons} name="save" size={25}/>
                    <Text style={styles.text}>
                      Ausgewählte Bilder werden im internen Speicher gespeichert. 
                      Wichtig nur, wenn das Hochladen nicht funktioniert.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
    padding: 10,
  },
  title: {
    fontSize: 25,
    // color: '#007AFF',
  },
  // subtitle: {
  //   fontSize: 20,
  //   padding: 10,
  // },
  table: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width:300, 
    height:40,
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
})