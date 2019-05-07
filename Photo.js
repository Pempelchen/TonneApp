import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACTION_ZEN_MODE_SCHEDULE_RULE_SETTINGS } from 'expo/build/IntentLauncherAndroid/IntentLauncherAndroid';

const pictureSize = 150;

export default class Photo extends React.Component {
  
  _mounted = false;

  componentDidMount() {
    this._mounted = true;
  }


  componentWillUnmount() {
    this._mounted = false;
  }

  toggleSelection = () => {
    this.setState(
      () => this.props.onSelectionToggle(this.props.uri, !this.props.isSelected)
    ) 
  }
 
  getImageDimensions = ({ width, height }) => {
    if (width > height) {
      const scaledHeight = pictureSize * height / width;
      return {
        width: pictureSize,
        height: scaledHeight,

        scaleX: pictureSize / width,
        scaleY: scaledHeight / height,

        offsetX: 0,
        offsetY: (pictureSize - scaledHeight) / 2,
      };
    } else {
      const scaledWidth = pictureSize * width / height;
      return {
        width: scaledWidth,
        height: pictureSize,

        scaleX: scaledWidth / width,
        scaleY: pictureSize / height,

        offsetX: (pictureSize - scaledWidth) / 2,
        offsetY: 0,
      };
    }
  };

  render() {
    const { uri } = this.props;  
    return (
      <View>
        <TouchableOpacity
          style={styles.pictureWrapper}
          onPress={this.toggleSelection}
          activeOpacity={1}
        >
          <Image
            style={styles.picture}
            source={{ uri }}
          /> 
          { (this.props.selectAll 
            ? true
            : (this.props.selectAll === undefined
              ? this.props.isSelected
              : false)) && <Ionicons name="md-checkmark-circle" size={30} color='#007AFF' />}
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({ 
  picture: { 
    position: 'absolute', 
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: 'contain', 
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
});