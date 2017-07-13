'use strict';
import React, { Component } from 'react';
import {
  View,
  Image,
  NativeModules
} from 'react-native';

export default class ImageBrowserApp extends Component {
  renderImage(imgURI) {
    return (
      <Image style={{width:100,height:100}} source={{uri: imgURI}} />
    );
  }
  render() {
    alert(this.props.images)
    return (
      <View>
       
      </View>
    );
  }
}