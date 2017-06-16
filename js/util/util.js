/*!
 *
 * Util模块 React Native module
 * 主要提供工具方法
 *
 */
import Dimensions from 'Dimensions';
import React, { Component } from 'react';
import {
  PixelRatio
} from 'react-native';


module.exports = {
  /*最小线宽*/
  pixel: 1 / PixelRatio.get(),

  /*屏幕尺寸*/
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  /*loading效果*/
  //loading: <ActivityIndicatorIOS color="#3E00FF" style={{marginTop:40}}/>
};