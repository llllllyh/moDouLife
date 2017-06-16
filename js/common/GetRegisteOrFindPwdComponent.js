import React,{Component} from 'react';
import{
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image
}from 'react-native';

import Config from '../util/config';
import NavigationBar from './NavigationBar';
import { Hoshi } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import Toast, {DURATION} from 'react-native-easy-toast';
import {CountDownText} from 'react-native-sk-countdown'

export default class GetRegisteOrFindPwdComponent extends Component{
	constructor(props){
		super(props);
		this.state = {
			codeSent:false,
			phoneNumber:'',
			verifyCode:'',
			emailCode:'',
			countingDone:false,
			isInputCode:false,
			validateCode:'code',
		}
	}

	_changeCodeImg(){
		 let datetime = new Date();
		this.setState({validateCode:Config.api.base+Config.api.get_validate+'?datetime='+datetime});
	}


	componentDidMount(){
		this.setState({validateCode:Config.api.base+Config.api.get_validate});
	}

	_pop(){
		this.props.navigator.pop();
	}

	_sendCodeOper(){
		this.setState({countingDone:true});
	}
	_countingDone(){
		this.setState({countingDone:false});
	}
	_getEmailCodeOper(){
		//this.setState({codeSent:true});
		
	}

	render(){

		return (
			<View style={styles.container}>
				<NavigationBar 
					title={this.props.componentTitle}
					style={styles.bar}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
				/>
				<View style={{padding:20}}>
					<View style={{marginBottom:15}}>
						<Hoshi
						    label={'中国+86：'}
						    borderColor={'#b76c94'}
						    backgroundColor={'#fff'}
						    maxLength={11}
						    clearButtonMode='while-editing'
						    onChangeText={(text) => {
								this.setState({
									phoneNumber:text
								})
							}}
						/>
					</View>
					<View style={{marginBottom:15,flexDirection:'row'}}>
						<Hoshi
							style={{flex:1,marginRight:10}}
						    label={'验证码：'}
						    borderColor={'#b76c94'}
						    maxLength={4}
						    backgroundColor={'#fff'}
						    clearButtonMode='while-editing'
						    onChangeText={(text) => {
						    	let flag;
						    	if(text.length>=4){
									flag=true;
						    	}else{
						    		flag=false;
						    	}
								this.setState({
									verifyCode:text,
									isInputCode:flag
								})
							}}
						/>
						<TouchableOpacity onPress={this._changeCodeImg.bind(this)} style={styles.validate_code}>
							<Image style={styles.validate_img} source={{uri:this.state.validateCode}}/>
						</TouchableOpacity>
					</View>
					{
						this.state.codeSent?
						<View style={{marginBottom:15}}>
							<Hoshi
							    label={'短信验证码：'}
							    borderColor={'#b76c94'}
							    backgroundColor={'#fff'}
							    clearButtonMode='while-editing'
							    onChangeText={(text) => {
									this.setState({
										emailCode:text
									})
								}}
							/>
						</View>
						:null
					}
					{
						this.state.isInputCode?
							<Button style={styles.btn} onPress={this._getEmailCodeOper.bind(this)}>发送</Button>
						:
						this.state.countingDone?
						<CountDownText 
						 	style={styles.countBtn}
						    countType='seconds' // 计时类型：seconds / date
				            auto={true} // 自动开始
				            afterEnd={this._countingDone.bind(this)} // 结束回调
				            timeLeft={3} // 正向计时 时间起点为0秒
				            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
				            startText='获取验证码' // 开始的文本
				            endText='获取验证码' // 结束的文本
				            intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
						/>
						:
						<Button style={styles.btn} onPress={this._sendCodeOper.bind(this)}>获取短信验证码</Button>
					}
					
				</View>
				<Toast 
                    ref="toast"
                    style={styles.sty_toast}
                   	position='center'
                />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#fff'
	},
	bar:{
		backgroundColor:'#ee735c',
	},
	btn:{
		padding:10,
		marginTop:50,
		backgroundColor:'transparent',
		borderColor:'#ee735c',
		borderWidth:1,
		borderRadius:4,
		color:'#ee735c'
	},
	bar_btn:{
		color:'#fff',
		fontSize:15,
		paddingLeft:5,
		paddingRight:5,
		fontWeight:'bold'
	},
	countBtn:{
		padding:10,
		marginTop:50,
		marginLeft:8,
		backgroundColor:'#ee735c',
		color:'#fff',
		borderColor:'#ee735c',
		textAlign:'center',
		fontWeight:'600',
		fontSize:15,
		borderRadius:2
	},
	validate_code:{
		width:122,
		height:52,
		borderWidth:1
	},
	validate_img:{
		width:120,
		resizeMode:'stretch',
		height:50
	}
})