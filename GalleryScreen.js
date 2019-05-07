import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { FileSystem, MediaLibrary, Permissions } from 'expo';
import { MaterialIcons, Ionicons, Octicons } from '@expo/vector-icons';
import Photo from './Photo';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

export default class GalleryScreen extends React.Component {
  state = {
    photos: [],
    selected: [],
    assets: [],
    myAlbum: {}, 
    selectAll: false,     
    showMoreOptions: false,   
    responses: [],                                             
  };

  componentDidMount = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({ photos });
  };

  toggleMoreOptions = () => this.setState({ showMoreOptions: !this.state.showMoreOptions });
  
  toggleSelectAll = () => {
    if (this.state.selectAll == false || this.state.selectAll == undefined) {
      var selected = this.state.photos.map(uri => PHOTOS_DIR + '/' + uri);
    }    
    else var selected = [];
    this.setState({ selected });
    this.setState({selectAll: !this.state.selectAll});
  }

  toggleSelection = (uri, isSelected) => {
    let selected = this.state.selected;
    selected = selected.filter(item => item !== uri)
    if (isSelected) {
      selected.push(uri);
    }
    this.setState({ selected });
    if (selected.length == this.state.photos.length) {
      this.setState({selectAll: true})
    }
    else  if (selected.length == 0)  {
      this.setState({ selectAll: false })
    } 
    else {this.setState({ selectAll: undefined })}
  }; 

  saveToDocuments = async () => {
    const photos = this.state.selected;
    
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
        throw new Error('Denied CAMERA_ROLL permissions!');
    }
      
    const myAlbum = await MediaLibrary.getAlbumAsync( globalDirName )   

    const promises = photos.map(photoUri => {
      return MediaLibrary.createAssetAsync(photoUri);
    }) 
    assets = await Promise.all(promises);

    if (myAlbum == null) {  
      newAlbum = await MediaLibrary.createAlbumAsync( globalDirName, assets[0], false );
      assets.shift();
      await MediaLibrary.addAssetsToAlbumAsync(assets, newAlbum, false  );
      Alert.alert('Speichern','Ordner erstellt und Fotos gespeichert!');         
    }  
    else{
      await MediaLibrary.addAssetsToAlbumAsync( assets, myAlbum, false );
      Alert.alert( 'Speichern',`Fotos gespeichert!`); 
    }
  } 
  
  deletePhoto = async (selection) => {
    var photos = this.state.photos;
    var selected = this.state.selected;
    photos = photos.filter(photo => !selection.includes(PHOTOS_DIR + '/' + photo))
    selected = selected.filter(photoUri => !selection.includes(photoUri))
    if (selection.length > 0){
      promises = selection.map(photoUri => {
        return FileSystem.deleteAsync(photoUri);
      }); 
      await Promise.all(promises); 
    }else { 
    }
    this.setState({photos});
    this.setState({ selected });
    this.setState(                                                                                          //das ist für die Fotoanzahl Anzeige im Kameramodus
      () => this.props.pictures(photos.length)
    );
  };

  renderPhoto = fileName => 
    <Photo
      key={fileName}
      uri={`${PHOTOS_DIR}/${fileName}`}
      onSelectionToggle={this.toggleSelection} 
      selectAll={this.state.selectAll}
      isSelected={this.state.selected.includes(PHOTOS_DIR + '/' + fileName)}
    />;

  uploadPressed = async() => {
    if (globalDirName == '') {
      alert('Bitte Barcode scannen!')
    }
    else {
      Alert.alert(
        'Bilder Hochladen', `Es sollen ${this.state.selected.length} Bilder hochgeladen werden.`,
        [{
          text: 'Cancel',
          onPress: () => {console.log('Cancel Pressed')},
          style: 'cancel', 
        },
        {
          text: 'OK', 
          onPress: () => { 
            this.state.selected.map(this.uploadPhotoAsync);
            // for (photo in this.state.selected) {
            //   await setTimeout(() => {
            //     this.uploadPhotoAsync(photo)
            //   }, photo  * 1000); 
            // }
            console.log('OK Pressed');
            Alert.alert(
              'Upload beendet!', 'Wie wollen Sie weiter vorgehen?',
            [{
              text: 'Weitere Bilder',
              onPress: () => {
                console.log('Weitere Bilder');
                // for (x in this.state.responses){//
                // this.state.responses[x].message == "success!" ? console.log('success') : console.log('fail')}
              },
            },
            {
              text: 'Neues Projekt',
              onPress: () => {
                this.uploadEndAsync();
              }
            }
            ]);
          },
        },
      ],      
      );
    }
  }

  uploadEndAsync = async() => {
    const fileName = '.txt';
    const fileType = 'txt';
    const formData = new FormData();
    const uri = this.state.selected[0];
    
    await setTimeout(() => {
      formData.append('photo', {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: `_${globalDirName}_${fileName}`,//der Anfang des Namens kommt vom Server `${file.fieldname}_${Date.now()}_${file.originalname}`
        type: `image/${fileType}`,
      });
      fetch('http://139.30.111.203:3000/api/upload', {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        var responses = this.state.responses;
        responses.push(response);
        this.setState({ responses})
        //   this.deletePhoto([uri]);
      })
      .catch(error => {
        console.log("upload error", error);
        var responses = this.state.responses;
        responses.push(error);
        this.setState({ responses })
        alert("Upload failed!");
      });
      this.abort(); 
    }, 5000)
    
  }

  sleep = (milliseconds) => {
    console.log('sleep')
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  uploadPhotoAsync = async(uri) => {
    
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    var fileName = this.state.photos.find( fileName => (PHOTOS_DIR + '/' + fileName) === uri);
    
    const formData = new FormData();

    formData.append('photo', {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name: `${globalDirName}_${fileName}`,//der Anfang des Namens kommt vom Server `${file.fieldname}_${Date.now()}_${file.originalname}`
      type: `image/${fileType}`,
    });
    fetch('http://139.30.111.203:3000/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(response => {
      console.log("upload succes", response);
      var responses = this.state.responses;
      responses.push(response);
      this.setState({ responses})
    })
    .catch(error => {
      console.log("upload error", error);
      var responses = this.state.responses;
      responses.push(error);
      this.setState({ responses })
      alert("Upload failed!");
    });
  }

  abort = () => {
    Alert.alert(
      'Beenden', 'Beim Beenden werden die aktuellen Fotos gelöscht',
      [{
        text: 'Cancel',
        onPress: () => {console.log('Cancel Pressed')},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        this.setState(() => {return{selectAll: false}});
        this.toggleSelectAll();
        this.deletePhoto(this.state.selected);
        globalDirName = '';
        this.setState( () => this.props.barcode());
        console.log('OK Pressed')},
    },],
    )
  }

  renderTopBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.topButton} onPress={this.props.onPress}>
        <MaterialIcons name="arrow-back" size={25} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity  style={styles.topButton}  onPress={this.toggleSelectAll} >
            <Ionicons name="md-checkmark-circle" size={30} color='white'/>
          </TouchableOpacity>
{/* 
      <TouchableOpacity style={styles.topButton} onPress= {() => {this.state.selected.length > 0 ? (this.saveToDocuments()) : alert('Kein Foto ausgewählt')}}>
        <MaterialIcons name="save" size={25} color="white" />
      </TouchableOpacity> */}

       <TouchableOpacity style={styles.topButton}  onPress={ this.uploadPressed }  >
        <MaterialIcons name="file-upload" size={30} color={'white' }/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.topButton} onPress={this.toggleMoreOptions}>
        <Octicons name="kebab-vertical" size={25} color='white'/>
      </TouchableOpacity>

      {this.state.showMoreOptions && this.renderMoreOptions()}
    </View>
  )

  renderMoreOptions = () => (
    <View style={styles.options}>
        <View style={styles.moreOptionsChooser}>
          <TouchableOpacity style={styles.topButton} onPress={() => {this.deletePhoto( this.state.selected )}}>
            <MaterialIcons name="delete" size={25} color="white" />
          </TouchableOpacity> 

          <TouchableOpacity style={styles.topButton} onPress={() => {this.abort()}}>         
            <Ionicons name="md-close-circle" size={25} color="white"/>
          </TouchableOpacity>
          
      <TouchableOpacity style={styles.topButton} onPress= {() => {this.state.selected.length > 0 ? (this.saveToDocuments()) : alert('Kein Foto ausgewählt')}}>
        <MaterialIcons name="save" size={25} color="white" />
      </TouchableOpacity>
      </View>
    </View> 
  )

  render() {
    return (
      <View style={styles.container}>
        <View>
          {this.renderTopBar()}
        </View>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            
            { this.state.photos.map(this.renderPhoto)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: '#007AFF', 
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  topButton:{
    padding: 10, 
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    bottom: 20, 
    flex: 0.3, /* 
    height: 100, */ 
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    position: 'absolute',
    top: 0,
    right: 60,
    width: 200,
    height: 50, 
    backgroundColor: '#000000BA',
    borderRadius: 4,
    padding: 10,
  },
  moreOptionsChooser:{  
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
});
