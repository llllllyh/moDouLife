import React,{Component} from 'react';
import{
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

import LoginPage from './login/LoginPage';
import RegisterPage from '../common/GetRegisteOrFindPwdComponent';

import Util from '../util/util';

import Icon from 'react-native-vector-icons/FontAwesome';
export default class IndexPage extends Component{


	_loginPhoneOper(){
		this.props.navigator.push({
			component:LoginPage
		})
	}

	_loginQQOper(){

	}

	_loginWeiXinOper(){

	}

	_registerOper(){
		this.props.navigator.push({
			component:RegisterPage,
			params:{
				componentTitle:'用户注册'
			}
		})
	}
	render(){
		return (
			<View style={styles.container}>	
				<Image source={require('../../res/images/index_bg.png')} style={styles.bg_pic}>
					<View style={styles.view_btn}>
						<TouchableOpacity style={styles.iconBtn} onPress={this._loginQQOper.bind(this)}>
							<Icon style={styles.color_blue} name='qq' size={28}/>
							<Text style={[styles.btn,styles.color_blue]} >
								QQ帐号登录
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.iconBtn} onPress={this._loginWeiXinOper.bind(this)}>
							<Icon style={styles.color_green} name='weixin' size={28}/>
							<Text style={[styles.btn,styles.color_green]} >
								微信帐号登录
							</Text>
						</TouchableOpacity>
						<View style={styles.bottom_text}>
							<TouchableOpacity onPress={this._loginPhoneOper.bind(this)}>
								<Text style={styles.text}>手机号密码登录</Text>
							</TouchableOpacity>
							<View style={{borderWidth:1}}/>
							<TouchableOpacity onPress={this._registerOper.bind(this)}>
								<Text style={styles.text}>注册</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Image>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#fff'
	},
	bg_pic:{
		width:Util.size.width,
		height:Util.size.height
	},
	view_btn:{
		height:Util.size.height,
		justifyContent:'flex-end',
		alignItems:'center',
		paddingBottom:130,
	},
	btn:{
		color:'black',
		fontSize:17,
		marginLeft:10
	},
	bottom_text:{
		flexDirection:'row',
		backgroundColor:'transparent',
		position:'absolute',
		paddingBottom:30
	},
	text:{
		paddingLeft:5,
		paddingRight:5,
		fontSize:16
	},
	iconBtn:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		marginTop:10,
		backgroundColor:'#fff',
		width:Util.size.width/1.5,
		paddingBottom:10,
		paddingTop:10
	},
	color_green:{
		color:'#62b900'
	},
	color_blue:{
		color:'#5294D0'
	},
	logo:{
		flex:1
	}
})
