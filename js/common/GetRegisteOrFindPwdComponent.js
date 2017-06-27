import React,{Component} from 'react';
import{
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
}from 'react-native';

import Config from '../util/config';
import NavigationBar from './NavigationBar';
import { Hoshi } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import Toast, {DURATION} from 'react-native-easy-toast';
import {CountDownText} from 'react-native-sk-countdown'
import UserDao from '../expand/dao/userDao';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
export default class GetRegisteOrFindPwdComponent extends Component{
	constructor(props){
		super(props);
		this.userDao = new UserDao();
		this.state = {
			codeSent:false,
			phoneNumber:'',
			verifyCode:'',
			emailCode:'',
			validateCode:'code',
			isCanEdit:true,
			isVerifyCodeCheckIn:false,
			isAgainGetVarifyCode:false			
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

	

	_countingDone(){
		this.setState({isAgainGetVarifyCode:true,isVerifyCodeCheckIn:false});
	}
	_getEmailCodeOper(){
		let phoneNumber=this.state.phoneNumber;
		let verifyCode=this.state.verifyCode;
		console.log(verifyCode)
		let patrn = /^[1][0-9]{10}$/;
		if(!phoneNumber){
			this.refs.toast.show('手机号码不能为空！');
			return;
		}
		if(!verifyCode){
			this.refs.toast.show('手机号码不能为空！');
			return;
		}
		if(!patrn.exec(phoneNumber)){
			this.refs.toast.show('请输入正确格式的手机号码！');
			return;
		}
		this.setState({isCanEdit:false});
		this.userDao.sendEmailCheckIn(phoneNumber,verifyCode,this.props.pageType)
			.then(res =>{
				 if(!res.message){
				 	let datetime = new Date();
				 	this.refs.toast.show(res.message+'');
				 	this.setState({isCanEdit:true,validateCode:Config.api.base+Config.api.get_validate+'?datetime='+datetime});
				 }else{
				 	this.setState({codeSent:true,isVerifyCodeCheckIn:true});
				 }
			})

	}

	_againGetVarifyCode(){
		this.setState({isCanEdit:true,isVerifyCodeCheckIn:false,isAgainGetVarifyCode:false,codeSent:false});
	}

	_isPass(){
		let user = {};
		user.validateCode=this.state.emailCode;
        user.username=this.state.phoneNumber;
       	this.userDao.checkInPhone(user)
       		.then(res => {
       			console.log(res)
       		})
       		.catch((error) => {
       			console.log(error)
       		})
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
						    editable={this.state.isCanEdit}
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
							style={{flex:1,marginRight:30}}
						    label={'验证码：'}
						    editable={this.state.isCanEdit}
						    borderColor={'#b76c94'}
						    maxLength={4}
						    backgroundColor={'#fff'}
						    clearButtonMode='while-editing'
						    onChangeText={(text) => {
								this.setState({
									verifyCode:text,
								})
							}}
						/>
						{
							this.state.isVerifyCodeCheckIn ?
							<CountDownText 
						 	style={[styles.countBtn]}
						    countType='seconds' // 计时类型：seconds / date
				            auto={true} // 自动开始
				            afterEnd={this._countingDone.bind(this)} // 结束回调
				            timeLeft={60} // 正向计时 时间起点为0秒
				            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
				            startText='获取验证码' // 开始的文本
				            endText='重新获取' // 结束的文本
				            intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
							/>
							:
							this.state.isAgainGetVarifyCode ?
							<TouchableOpacity style={styles.validate_code} onPress={()=>this._againGetVarifyCode()}>
								<Text style={styles.againBtn}>点击重新获取</Text>
							</TouchableOpacity>
							:
							<TouchableOpacity onPress={this._changeCodeImg.bind(this)} style={styles.validate_code}>
								<Image 
									 indicator={Progress.Circle}
									  indicatorProps={{
									    size: 50,
									    color: 'rgba(150, 150, 150, 1)',
									    unfilledColor: 'rgba(200, 200, 200, 0.2)'
									  }}
									style={styles.validate_img} 
									source={{uri:this.state.validateCode}}/>
							</TouchableOpacity>
						}
						
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
						this.state.isVerifyCodeCheckIn?
						<Button style={styles.btn} onPress={this._isPass.bind(this)}>发送</Button>
						:
						<Button style={styles.btn} onPress={this._getEmailCodeOper.bind(this)}>获取短信验证码</Button>
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
		height:50,
		width:122,
		lineHeight:50,
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

	},
	validate_img:{
		width:120,
		resizeMode:'stretch',
		height:50
	},
	againBtn:{
		textAlign:'center',
		height:50,
		width:122,
		lineHeight:48,
		backgroundColor:'#ee735c',
		color:'#fff',
		fontWeight:'600',
		fontSize:15,
	}
})