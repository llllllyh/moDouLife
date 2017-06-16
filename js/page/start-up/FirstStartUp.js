import React,{Component} from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	AsyncStorage
} from 'react-native';
import IndexPage from '../IndexPage';
import WelcomePage from './WelcomePage';
import Util from '../../util/util';
import Swiper from 'react-native-swiper';
import Button from 'react-native-button';
export default class FirstStartUp extends Component{
	constructor(props){
		super(props);
		this.state = {
			loop:false,
		}
	}


	_enter(){
		AsyncStorage.setItem('isFirst','false');
		this.props.navigator.resetTo({
			component:IndexPage
		})
	}

	render(){
		return (
			 <Swiper
				 dot={<View style={styles.dot} />}
				 activeDot={<View style={styles.activeDot}/>}
				 paginationStyle={styles.pagination}
			 	 loop={this.state.loop}>
		        <View style={styles.slide}>
		         	<Image style={styles.image} source={require('../../../res/images/pic/start_up_1.png')} />
		        </View>
		        <View style={styles.slide}>
		          	<Image style={styles.image} source={require('../../../res/images/pic/start_up_2.png')} />
		        </View>
		        <View style={styles.slide}>
		          	<Image style={styles.image} source={require('../../../res/images/pic/start_up_3.png')} />
		        	<Button style={styles.btn} onPress={this._enter.bind(this)}>马上体验</Button>
		        </View>
	         </Swiper>
		)
	}


}

var styles = StyleSheet.create({
	slide:{
		flex:1,
		width:Util.size.width
	},
	image:{
		flex:1,
		width:Util.size.width
	},
	dot:{
		 width:13,
		 height:13,
		 backgroundColor:'transparent',
		 borderColor:'#ff6600',
		 borderRadius:7,
		 borderWidth:1,
		 marginLeft:12,
		 marginRight:12
	},
	activeDot:{
		width:14,
		height:14,
		borderWidth:1,
		marginRight:12,
		marginLeft:12,
		borderRadius:7,
		borderColor:'#ff6600', 
		backgroundColor:'#ee735c'
	},
	pagination:{
		bottom:30
	},
	btn:{
		position:'absolute',
		width:Util.size.width-20,
		left:10,
		bottom:60,
		height:50,
		paddingTop:15,
		marginTop:30,
		fontSize:18,
		backgroundColor:'#ee735c',
		borderColor:'#ee735c',
		borderWidth:1,
		borderRadius:3,
		color:'#fff'
	},

	
});
