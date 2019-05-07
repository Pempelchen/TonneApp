import React from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Foundation} from '@expo/vector-icons';
import {Constants, BarCodeScanner, Permissions, Camera, FileSystem} from 'expo' 
import GalleryScreen from './GalleryScreen';

const flashModeOrder = {     //Blitzlicht -> wahrscheinlich einfach auf Blitz an voreinstellen
    on: 'off',
    off: 'torch',                 //evtl. an und aus erlauben, oder torch
    //auto: 'torch',
    torch: 'on',
   };
     
const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  // auto: 'flash-auto',
  torch: 'highlight'
};
   
export default class NeuesProjektScreen extends React.Component{
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  }

  state = {
    flash: 'on',
    ratio: '16:9',
    ratios: [],
    barcodeScanning: true,
    newPhotos: false,
    permissionsGranted: false,  
    showMoreOptions: false,            
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    pictures : 0,                                                                 
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === 'granted' });
  }

  //Ordner erstellen, falls noch nicht vorhanden, um aufgenommene Fotos zu speichern
  componentDidMount() {
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  //Verfügbare Bildformate ermitteln
  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };    

  toggleView = () => this.setState({ showGallery: !this.state.showGallery, newPhotos: false});           

  toggleFlash = () => this.setState({ flash: flashModeOrder[this.state.flash] });

  toggleBarcodeScanning = () => this.setState({ barcodeScanning: !this.state.barcodeScanning });

  takePicture = () => {
    if (this.camera) {
      if (globalDirName !== ''){
        this.camera.takePictureAsync({ skipProcessing: true, onPictureSaved: this.onPictureSaved });
      }
      else{
        Alert.alert(`Bitte zuerst Barcode scannen`);
      }
    }
  };

  handleMountError = ({ message }) => console.error(message);

  onPictureSaved = async photo => {
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`,
    });
    this.setState({ newPhotos: true });
    this.setState((state) => {return{pictures: state.pictures + 1}});    
  }

  // yyyymmdd = () => {
  //   var now = new Date();
  //   var y = now.getFullYear();
  //   var m = now.getMonth() + 1;
  //   var d = now.getDate();
  //   return '_' + y + (m < 10 ? '0' :'') + m + (d < 10 ? 0 : '') + d;
  // } 

  onBarCodeScanned = code => {
    this.setState(
      { barcodeScanning: !this.state.barcodeScanning },
      Alert.alert(`Barcode found: ${code.data}`),
    ); 
    globalDirName = code.data;
  };

  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(this.state.ratio);
      let pictureSizeId = 0;
      if (Platform.OS === 'ios') {
        pictureSizeId = pictureSizes.indexOf('High');
      } else { 
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length-1;
      }
      this.setState({ pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId] });
    }
  };

  previousPictureSize = () => this.changePictureSize(1);

  nextPictureSize = () => this.changePictureSize(-1);

  changePictureSize = direction => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length -1;
    }
    this.setState({ pictureSize: this.state.pictureSizes[newId], pictureSizeId: newId });
  }

  togglePictures = (pictures) => {
    this.setState({pictures});
  }

  renderGallery() {
    return <GalleryScreen 
    onPress={this.toggleView.bind(this)} 
    pictures = {this.togglePictures} 
    barcode = {this.toggleBarcodeScanning}
    />;
  }

  renderNoPermissions = () => 
    <View style={styles.noPermissions}>
      <Text style={{ color: 'white' }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>
 
  renderTopBar = () => 
    <View
      style={styles.topBar}> 
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
        <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white" />
      </TouchableOpacity>   
      <Text style={{color: '#fff', fontSize: 30, lineHeight: 80}}> 
        {this.state.pictures}                                      
      </Text>
    </View>


  renderBottomBar = () =>
  <View
    style={styles.bottomBar}>
    <TouchableOpacity  style={styles.bottomButton} onPress={this.toggleBarcodeScanning}>
        <MaterialCommunityIcons name="barcode-scan" size={30} color={this.state.barcodeScanning ? "white" : "#858585" } />
    </TouchableOpacity>

    <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={this.takePicture}
          style={{ alignSelf: 'center' }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
    </View> 

    <TouchableOpacity style={styles.bottomButton} onPress={this.toggleView}>
      <View>
        <Foundation name="thumbnails" size={30} color="white" />
        { this.state.newPhotos &&  <View style={styles.newPhotosDot}></View>}
      </View>
    </TouchableOpacity>
  </View>

  renderCamera = () =>
    (
      <View style={{ flex: 1 }}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          onCameraReady={this.collectPictureSizes}
          flashMode={this.state.flash}
          ratio={this.state.ratio}
          pictureSize={this.state.pictureSize}
          onMountError={this.handleMountError}
          barCodeScannerSettings={{
            barCodeTypes: [
              BarCodeScanner.Constants.BarCodeType.code128,
              // BarCodeScanner.Constants.BarCodeType.qr,
              // BarCodeScanner.Constants.BarCodeType.pdf417,
            ],
          }}
          onBarCodeScanned={this.state.barcodeScanning ? this.onBarCodeScanned : undefined}
          >
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </Camera>
      </View>
    );

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
      const content = this.state.showGallery ? this.renderGallery() : cameraScreenContent;
      return <View style={styles.container}>{content}</View>;
  }
} 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
      justifyContent: 'space-between',
    },
    topBar: {
      flex: 0.2,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: Constants.statusBarHeight / 2,
    },
    bottomBar: {
      /*paddingBottom: isIPhoneX ? 25 : 5,*/
      backgroundColor: 'transparent',
      alignSelf: 'flex-end',
      justifyContent: 'space-between',
      flex: 0.15,
      flexDirection: 'row',
    }, 
    noPermissions: {
      flex: 1,
      alignItems:'center',
      justifyContent: 'center',
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
    bottomButton: {
      flex: 0.3, 
      height: 58, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    newPhotosDot: {
      position: 'absolute',
      top: 0,
      right: -5,
      width: 8,
      height: 8,
      borderRadius: 4, 
      backgroundColor: '#007AFF',
    },
    // row: {
    //   flexDirection: 'row',
    // },
  });
