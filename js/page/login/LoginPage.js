import React,{Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Alert
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import HomePage from '../HomePage';
import FindPwd from '../../common/GetRegisteOrFindPwdComponent';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hoshi } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import Toast, {DURATION} from 'react-native-easy-toast';

import UserDao from '../../expand/dao/userDao';
export default class LoginPage extends Component{

	constructor(props){
		super(props);
		this.userDao = new UserDao();
		this.state = {
			phoneNumber: '',
			password:'',
			isLogining:false,
			isCanEdit:true
		}
	}

	_toFindPwdComponent(){
		this.props.navigator.push({
			component:FindPwd,
			params:{
				componentTitle:'找回密码',
				pageType:'find'
			}
		});
	}

	_pop(){
		this.props.navigator.pop();
	}

	_submit(){
		if(this.state.isLogining){
			this.refs.toast.show('正在努力登录中...');
			return;
		}
		this.setState({isLogining:true})
		let phoneNumber=this.state.phoneNumber;
		let password=this.state.password;
		let patrn = /^[1][0-9]{10}$/;
		if(!phoneNumber){
			this.setState({isLogining:false})
			this.refs.toast.show('手机号码不能为空！');
			return;
		}
		if(!password){
			this.setState({isLogining:false})
			this.refs.toast.show('密码不能为空！');
			return;
		}
		if(!patrn.exec(phoneNumber)){
			this.setState({isLogining:false})
			this.refs.toast.show('请输入正确格式的手机号码！');
			return;
		}
		if(password.length<5){
			this.setState({isLogining:false})
			this.refs.toast.show('密码不能少于5位！');
			return;
		}
		let url = 'username='+phoneNumber+'&password='+password+'&remember-me=on';
		this.setState({isCanEdit:false});
		this.userDao.userLoginOper(url)
			.then(response => {
				this.props.navigator.push({
					component:HomePage
				})
			})
			.catch((error) => {

				Alert.alert(
					'错误提示',
					(''+error).substring(7),
					[
						{
							text:'确定'
						}
					]
				)
				this.setState({isLogining:false,isCanEdit:true})
				return;
			})
		
	}

	render(){
		return(
			<View style={styles.container}>
				<NavigationBar 
					title='用户登录'
					style={styles.bar}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
					rightButton={<TouchableOpacity onPress={this._toFindPwdComponent.bind(this)}><Text style={styles.bar_btn}>找回密码</Text></TouchableOpacity>}
				/>
				<View style={{padding:20}}>
					<View style={{marginBottom:15}}>
						<Hoshi
						    label={'中国+86：'}
						    editable = {this.state.isCanEdit}
						    borderColor={'#b76c94'}
						    backgroundColor={'#fff'}
						    maxLength={11}
						    autoCapitalize={'none'}
							autoCorrect={false}
						    clearButtonMode='while-editing'
						    onChangeText={(text) => {
								this.setState({
									phoneNumber:text
								})
							}}
						/>
					</View>
				    <Hoshi
					    label={'密码：'}
					    editable = {this.state.isCanEdit}
					    borderColor={'#b76c94'}
					    backgroundColor={'#fff'}
					    secureTextEntry={true}
					    maxLength={12}
					    clearButtonMode='while-editing'
					    onChangeText={(text) => {
							this.setState({
								password:text
							})
						}}
				    />
 					<Button style={styles.btn} onPress={this._submit.bind(this)}>登陆</Button>
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
		marginBottom:20
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
		fontSize:18,
		paddingVertical:10,
		paddingHorizontal:5,
		fontWeight:'bold'
	},
	sty_toast:{
		backgroundColor:'#000',
		opacity: 0.8,
	}

})