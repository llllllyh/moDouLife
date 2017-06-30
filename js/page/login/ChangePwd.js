import React , {Component} from 'react';
import {
	TextInput,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Modal
} from 'react-native';
import IndexPage from '../IndexPage';
import NavigationBar from '../../common/NavigationBar';
import Util from '../../util/util';
import Button from 'react-native-button';
import UserDao from '../../expand/dao/userDao';
import Toast, {DURATION} from 'react-native-easy-toast';
export default class ChangePwd extends Component{

	constructor(){
		super();
		this.userDao = new UserDao();
		this.state = {
			newPwd:'',
			oldPwd:'',
			againPwd:'',
			isShowModal:false
		}
	}

	_pop(){
		this.props.navigator.pop();
	}

	_successToPage(){
		this.props.navigator.replace({
			component:IndexPage
		});
	}

	_confirmChange(){
		let body ={};
		body.username=this.props.username;
		body.password=this.state.newPwd;
		if(body.password.length<6){
			this.refs.toast.show('密码不能少于6位！');
			return;
		}
		if(this.props.pageType !== 'find'){
			if(this.state.newPwd !== this.state.againPwd){
				this.refs.toast.show('两次输入密码不一致！');
				return;
			}
			else if(this.state.oldPwd!==this.props.password){
				this.refs.toast.show('密码输入不正确！');
				return;
			}
		}
		this.setState({isShowModal:true});
		this.userDao.changePwdOper(body,this.props.pageType)
			.then(res => {
				this.refs.toast.show('密码修改成功！');
				setTimeout(()=>{
					this._successToPage();
				},1000);
			})
			.catch((error) => {
				this.setState({isShowModal:false});
				this.refs.toast.show('密码修改失败！');
				console.log(error)
			})
	}

	render(){
		return(
			<View style={styles.container}>
				<NavigationBar title='修改密码' 
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
				/>
				<View style={{backgroundColor:'#fff'}}>
					{
						this.props.pageType !== 'find' ?
							<View style={{paddingLeft:10,padding:2,borderWidth:Util.pixel,borderColor:'#D1D1D1'}}>
								<TextInput 
									maxLength={12}
								    clearButtonMode='while-editing'
									style={{height:35,borderColor:'#D1D1D1'}}
									placeholder='请输入旧密码'
									onChangeText={(text)=>{
										this.setState({
											oldPwd:text
										});
									}}
									/>
							</View>
							:null
					}
					
					<View style={{paddingLeft:10,padding:2}}>
						<TextInput 
							maxLength={12}
						    clearButtonMode='while-editing'
							style={{height:35,borderColor:'#D1D1D1'}}
							placeholder='请输入新密码'
							onChangeText={(text)=>{
								this.setState({
									newPwd:text
								});
							}}
							/>
					</View>
					{
						this.props.pageType !== 'find' ?
							<View style={{paddingLeft:10,padding:2,borderWidth:Util.pixel,borderColor:'#D1D1D1'}}>
								<TextInput 
									maxLength={12}
								    clearButtonMode='while-editing'
									style={{height:35,borderColor:'#D1D1D1'}}
									placeholder='请再次输入新密码'
									onChangeText={(text)=>{
										this.setState({
											againPwd:text
										});
									}}
									/>
							</View>
							:null
					}
					
				</View>
				<Text style={{color:'grey',margin:10}}>可由6-20个半角字符组成</Text>
				<View style={{padding:20}}>
					<Button onPress={()=>this._confirmChange()} style={styles.btn} onPress={this._confirmChange.bind(this)}>确认修改</Button>
				</View>
				<Toast 
                    ref="toast"
                    style={styles.sty_toast}
                   	position='center'
                />
                <Modal
                	style={{flex:1}}
                	transparent={true}
					visible={this.state.isShowModal}
                />
			</View>
		)
	}
}	

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#f3f3f4'
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
		marginLeft:10
	}
});