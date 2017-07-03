import React,{Component} from 'react';
import{
	StyleSheet,
	AsyncStorage,
	View,
	Text,
	Image,
	TouchableOpacity,
	Modal,
	DeviceEventEmitter,
	Alert
}from 'react-native';

import IndexPage from '../IndexPage';
import MorePage from './more/MorePage';
import CurrentInfoWrite from './info/CurrentInfoWrite';
import Util from '../../util/util';
import Config from '../../util/config';
import UserDao from '../../expand/dao/userDao';

import Button from 'react-native-button';
import NavigationBar from '../../common/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast';
export default class MyPage extends Component{

	constructor(props){
		super(props);
		this.userDao = new UserDao();
		let time = new Date().getTime();
		this.state = {
			isShowSet:false,
			isLoaded:false,
			loginUser:{},
			avatar:'?random='+time
		}
	}

	_asyGetUser(){
		console.log('asy')
		AsyncStorage.getItem('userInfo')
			.then((value) => {
				console.log(value)
				if(value){
					this.setState({
						isLoaded:true,
						loginUser:JSON.parse(value)
					});
				}else{
					this._getUserInfo();
				}
			})
			.catch((error) => {
				this._getUserInfo();
			})
	}

	_getUserInfo(){
		this.userDao.userInfoSet()
		.then(res => {
			console.log(res)
			if(res){
				this.setState({
					isLoaded:true,
					loginUser:res
				});
			}else{
				this.refs.toast.show('数据获取失败，请稍后再试！');
				return;
			}
		})
		.catch((error) => {
				this.refs.toast.show('请检查你的网络连接！');
				return;
		})
	}



	//TODO 获取用户信息
	componentDidMount(){
		this._asyGetUser();
		let self = this;
		this.listener = DeviceEventEmitter.addListener('changeUser' , function(user){
			let loginUser = self.state.loginUser;
			if(user.score){
				loginUser.score -= user.score;
			}

			if(user.nickName){
				loginUser.nickName = user.nickName;
			}

			if(user.qianMing){
				loginUser.qianMing = user.qianMing;
			}

			if(user.address){
				loginUser.address = user.address;
			}

			if(user.sex!==undefined){
				loginUser.sex = user.sex;
			}

			if(user.area){
				loginUser.district = user.area;
			}

			if(user.birthday){
				loginUser.birthday = user.birthday;
			}

			if(user.avatar){
				let time = new Date().getTime();
				self.setState({
					random:'&random='+time
				});
			}

			self.setState({
				loginUser
			});
		})


	}
	componentWillUnmount(){  
		this.listener.remove();  
	}

	_loginOut(){
		Alert.alert(
			'提示',
			'是否退出？',
			[
				{
					text:'否'
				},
				{
					text:'是', onPress: ()=> {
						this._clearUserInfo();
					}
				}
			]
		)
		
	}

	_clearUserInfo(){
		AsyncStorage.multiRemove(['userInfo','user','scoreRecords','collectionRecords','bookRecords'])
			.then((error,result) => {
				if(!error){
					this.props.navigator.resetTo({
						component:IndexPage
					})
				}
			});
	}

	_toAppSet(){
		 this.setState({isShowSet:true});
	}

	_toMyInfoSet(img){
		if(!this.state.isLoaded){
			console.log('return')
			return;
		}
		this.props.navigator.push({
			component:CurrentInfoWrite,
			params:{
				loginUser:this.state.loginUser,
				img:img,
			}
		});
	}
	_toChoosePage(page){
		this.props.navigator.push({
			component:page,
			params:{
				loginUser:this.state.loginUser
			}
		});
	}
	_closeModal(){
		 this.setState({isShowSet:false});
	}

	_renderInfoItem(title,componentPage,picture){
		return (
			<TouchableOpacity onPress={this._toChoosePage.bind(this,componentPage)} style={styles.set_item}>
				<View style={{justifyContent:'center',paddingLeft:20}}>
					<Image style={styles.set_item_img} source={picture}/>
				</View>
				<View style={{justifyContent:'center'}}>
					<Text style={styles.set_item_title}>
						{title}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}


	render(){
		let loginUser = this.state.loginUser;
		

		if(!loginUser){
			return <View/>
		}
		let base = Config.api.base.substring(0,Config.api.base.indexOf('/weixin'));
		let img = base+'/images/' + loginUser.myImg+'?random=';
		let myImg = base+'/images/' + loginUser.myImg+'?random='+this.state.random;

		return(
			<View style={{backgroundColor:'#f3f3f4',flex:1}}>
				<NavigationBar 
					style={styles.bar}
					title='我的'
					rightButton={
						<View style={{paddingRight:20}}>
							<Icon onPress={this._toAppSet.bind(this)} name='cog' size={18} style={styles.sty_cog}>
								<Text>设置</Text>
							</Icon>
						</View>
					}
				/>
				<View style={styles.my_baseInfo}>
					<View style={{flexDirection:'row'}}>
						<TouchableOpacity onPress={this._toMyInfoSet.bind(this,img)}>
							<Image style={styles.avatar} source={{uri:myImg}}/>
						</TouchableOpacity>
						<View style={styles.info}>
							<View>
								<Text style={styles.info_name}>
								{
									loginUser.nickName===undefined?
									null
									:
									loginUser.nickName
								}
								</Text>
							</View>
							<View style={styles.info_vip}>
								<Text>🏅️金牌会员</Text>
							</View>
							<View>
								<Text style={styles.info_score}>积分:{loginUser.score}</Text>
							</View>
						</View>
						<Button style={styles.level}>会员续费</Button>
					</View>
				</View>
				<View style={styles.set_items}>
					{this._renderInfoItem('个人相册',MorePage,require('../../../res/images/Picture.png'))}
					{this._renderInfoItem('打赏',MorePage,require('../../../res/images/wallet-2.png'))}
					{this._renderInfoItem('更多',MorePage,require('../../../res/images/pictures.png'))}
				</View>
				<View style={styles.loginOut_btn_view}>
					<Button style={styles.btn} onPress={this._loginOut.bind(this)}>退出登录</Button>
				</View>
				<Modal
		          animationType={'slide'}
		          transparent={false}
		          visible={this.state.isShowSet}
		          onRequestClose={() => {alert("Modal has been closed.")}}
		          >
		          	<View style={{flex:1,backgroundColor:'#f3f3f4'}}>
			          	<NavigationBar 
							title='设置'
							style={styles.bar}
							leftButton={<TouchableOpacity onPress={this._closeModal.bind(this)}><Text style={{color:'#fff',marginLeft:10}}>返回</Text></TouchableOpacity>}
			          	/>
			          	<View style={{marginTop:20}}/>
				          	{this._renderInfoItem('修改密码',MorePage,require('../../../res/images/password.gif'))}
				          	{this._renderInfoItem('版本更新',MorePage,require('../../../res/images/updates.gif'))}
				          	{this._renderInfoItem('关于我们',MorePage,require('../../../res/images/my.gif'))}
						</View>
		         </Modal>
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
	loginOut_btn_view:{
		padding:20,
		marginTop:Util.size.height/8,
		
	},
	btn:{
		padding:10,
		backgroundColor:'#ee735c',
		borderColor:'#ee735c',
		borderWidth:Util.pixel,
		borderRadius:4,
		color:'#fff'
	},
	bar:{
		backgroundColor:'#ee735c',
	},
	sty_cog:{
		color:'#fff',
	},
	my_baseInfo:{
		height:100,
		marginTop:20,
		borderWidth:Util.pixel,
		justifyContent:'center',
		borderColor:'#D1D1D1',
		backgroundColor:'#fff'
	},
	avatar:{
		width:80,
		height:80,
		borderWidth:Util.pixel,
		marginLeft:20,
		borderColor:'#D1D1D1'
	},
	info:{
		justifyContent:'center',
		paddingLeft:10,
		flex:2
	},
	info_name:{
		fontSize:18,
		paddingBottom:5,
		height:18,
	},
	info_score:{
		color:'red',
		paddingTop:5
	},
	info_vip:{
		flexDirection:'row',
		justifyContent:'flex-start',
	},
	vip_pic:{
		width:20,
		height:25,
	},
	level:{
		padding:5,
		paddingVertical:10,
		backgroundColor:'#76EE00',
		color:'#fff',
		justifyContent:'center',
		marginRight:20,
		marginTop:32
	},
	set_items:{
		marginTop:20
	},
	set_item:{
		height:45,
		borderWidth:Util.pixel,
		borderColor:'#D1D1D1',
		backgroundColor:'#fff',
		flexDirection:'row',

	},
	set_item_title:{
		fontSize:18,
		paddingLeft:10,
	
	},
	set_item_img:{
		width:35,
		height:35,
	}
	
})