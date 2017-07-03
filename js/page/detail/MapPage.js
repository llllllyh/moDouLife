import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity
} from 'react-native';


import TWebView from '../position/TWebView';
import NavigationBar from '../../common/NavigationBar';


export default class MapPage extends Component{


	_pop(){
		this.props.navigator.pop();
	}

	render(){
		return(
			<View style={styles.container}>
				<NavigationBar 
					title='定位'
					style={styles.bar}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
				/>
				<TWebView position={this.props.position} url="http://localhost:8081/res/html/nearby.html" />
			</View>
		)
	}

}


var styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#fff'
	},
	bar:{
		backgroundColor:'#ee735c',
		zIndex:99
	},
	bar_btn:{
		color:'#fff',
		fontSize:15,
		paddingLeft:5,
		paddingRight:5,
		fontWeight:'bold'
	},

});
