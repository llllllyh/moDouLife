import React,{Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	TextInput,
	Image,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
	AsyncStorage,
	ActivityIndicator,
} from 'react-native';

import FilterMenuPage from '../filter/FilterMenuPage';
import GetScoreByPay from '../pay/GetScoreByPay';
import Util from '../../util/util';
import Config from '../../util/config';
import SwiperComponent from '../../common/SwiperComponent';
import GetRecruitItemOrRentItem from '../../common/GetRecruitItemOrRentItem';
import RecruitDao from '../../expand/dao/recruitDao';
import RentRoomDao from '../../expand/dao/rentRoomDao';
import OtherDao from '../../expand/dao/otherDao';
import Icon from 'react-native-vector-icons/FontAwesome';
import CityPage from '../position/CityPage';
export default class HomeIndex extends Component{

	constructor(props){
		super(props);
		this.otherDao=new OtherDao();
		this.recruitDao=new RecruitDao();
		this.rentRoomDao = new RentRoomDao();
		this.state = {
			banners:['../../../res/images/pic/slider_pic_1.jpg'],
			recruitList:'',
			rentRoomList:'',
			userInfo:{},
			roomIsLoading:true,
			recruitIsLoading:true,
			roomIsSuccess:false,
			recruitIsSuccess:false,
			position:{},
		}
	}

	cityPage(){
		this.props.navigator.push({
			component:CityPage,
			params:{
				pageType:'location'
			}
		});
	}

	_loadAdPic(){
		let base = Config.api.base.substring(0,Config.api.base.indexOf('/weixin'));
		let arrPic=[]
		this.otherDao.getHomeAd()
			.then(res => {
				for(var i in res){
					let pic = base+'/images/guanggao/'+res[i].imageWay;
					arrPic.push(pic)
				}
			})
			.then(()=>{
				console.log(arrPic)
				this.setState({
					banners:arrPic
				});
			})
	}

	_loadRecruitData(){
		this.setState({recruitIsLoading:true});
		this.recruitDao.getHomeRecruit()
		  .then(res => {
	            if (res) {
	               	this.setState({
	               		recruitList:res,
	               		recruitIsLoading:false,
						recruitIsSuccess:true
	               	});
	            }else{
					this.setState({
	            		recruitIsLoading:false,
	               		recruitIsSuccess:false
	            	})
	            }
        	})
		  	.catch((error) => {
				this.setState({
            		recruitIsLoading:false,
               		recruitIsSuccess:false
	            })
		  	})
	}

	_loadRoomData(){
		this.setState({roomIsLoading:true});
		let position ={longitude:'113.27',latitude:'23'};
		this.rentRoomDao.getHomeRentRoomInfo(position)
			.then(res => {
 				if (res) {
	               	this.setState({
	               		rentRoomList:res,
	               		roomIsLoading:false,
	               		roomIsSuccess:true
	               	});
            	 }else{
	            	this.setState({
	            		roomIsLoading:false,
	               		roomIsSuccess:false
	            	})
	            }
        	})
		  	.catch((error) => {
		  		this.setState({
            		roomIsLoading:false,
               		roomIsSuccess:false
	            })
		  	})
	}



	componentDidMount(){
		AsyncStorage.getItem('user')
			.then((value) => {
				this.setState({
					userInfo:JSON.parse(value)
				});
				
			}).catch((error) => {
				console.log(error)
			})
		this._loadAdPic();
		this._loadRecruitData();
		this._loadRoomData();
		//监听位置信息变化，通过此属性传递给各个组件，监听的变化也会随之传递下去
		//可以做成全局
		this.watchID = navigator.geolocation.watchPosition((position) => {
			let getPosition = {};
			getPosition.latitude = position.coords.latitude;
			getPosition.longitude = position.coords.longitude;
			this.setState({
				position:getPosition
			});
			AsyncStorage.setItem('position', JSON.stringify(getPosition) , (error,result) => {
				if(error){
					console.log(error);
				}
			})
		});
		
		
	}

	componentWillUnmount(){
		navigator.geolocation.clearWatch(this.watchID);
	}

	_toMenuPage(title){
		if(title === '打赏'){
			this.props.navigator.jumpForward({
				component:GetScoreByPay,
				params:{
					title:title,
				}
			})
		}else{
			this.props.navigator.push({
				component:FilterMenuPage,
				params:{
					title:title,
					position:this.state.position,
					userInfo:this.state.userInfo
				}
			})
		}
		
	}

	_renderPart(title){
		let imgURL='';
		switch(title){
			case '全职招聘':
				imgURL=require('../../../res/images/home_icon_qz.png');
				break;
			case '兼职招聘':
				imgURL=require('../../../res/images/home_icon_jz.png');
				break;
			case '租房':
				imgURL=require('../../../res/images/home_icon_zf.png');
				break;
			case '社交':
				imgURL=require('../../../res/images/home_icon_sj.png');
				break;
			case '个人中心':
				imgURL=require('../../../res/images/home_icon_grzx.png');
				break;
			case '打赏':
				imgURL=require('../../../res/images/home_icon_ds.png');
				break;
		}
		return(
			<TouchableOpacity onPress={this._toMenuPage.bind(this,title)} style={{flex:1,alignItems:'center'}}>
				<Image style={{width:60,height:60,marginBottom:5}} source={imgURL} />
				<Text>{title}</Text>
			</TouchableOpacity>
		)
	}

	render(){
		return(
			<View style={styles.container}>
			<View style={styles.bar}>
					<TouchableOpacity style={styles.bar_betweem} onPress={()=>this.cityPage()}>
						<Text style={styles.bar_left_text}>广州<Icon name='caret-down'/></Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.bar_center}>
						<TextInput placeholder='请输入类别或者关键字' style={styles.bar_input}/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.bar_betweem}>
						<Text style={styles.bar_right_text}>附近的人</Text>
				 	</TouchableOpacity>
				</View>
				<ScrollView showsVerticalScrollIndicator={true} alwaysBounceVertical={false} bounces={false}>
					
					<View>
						<SwiperComponent banners={this.state.banners} />	
						<View style={{backgroundColor:'#fff',borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}}>
							<View style={{flexDirection:'row',paddingBottom:5,paddingTop:7}}>
								{this._renderPart('全职招聘')}
								{this._renderPart('兼职招聘')}
								{this._renderPart('租房')}
							</View>
							<View style={{flexDirection:'row',paddingBottom:5,paddingTop:7}}>
								{this._renderPart('社交')}
								{this._renderPart('个人中心')}
								{this._renderPart('打赏')}
							</View>
						</View>
						<View style={{backgroundColor:'#fff',marginTop:5}}>
							<Image style={{height:Util.size.height*0.2,width:Util.size.width}} source={require('../../../res/images/pic/ad_pic_1.jpg')}/>
						</View>
						<View style={{backgroundColor:'#fff',marginTop:5}}>
							<Image style={{height:Util.size.height*0.2,width:Util.size.width}}  source={require('../../../res/images/pic/ad_pic_2.jpg')}/>
						</View>
					</View>
					<View style={{marginTop:5,backgroundColor:'#fff'}}>
						<View style={{borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}}>
							<Text style={{padding:10,fontSize:16,fontWeight:'bold'}}>招聘专栏</Text>
						</View>
						{
							this.state.recruitIsLoading?
							<View style={{height:100,justifyContent:'center',alignItems:'center'}}>
								<ActivityIndicator
						          color="#ee735c"
						          size="small"
					        	/>
								<Text style={{fontSize:15,marginTop:10}}>正在努力加载中...</Text>
							</View>
							:
							!this.state.recruitIsSuccess ?
							<TouchableOpacity onPress={this._loadRecruitData.bind(this)} style={{height:100,justifyContent:'center',alignItems:'center'}}>
								<Text style={{fontSize:15}}>数据加载失败，点击刷新！</Text>
							</TouchableOpacity>
							:
							<GetRecruitItemOrRentItem pageType='all' position={this.state.position} uid={this.state.userInfo.userid} type='recruit' navigator={this.props.navigator} dataList={this.state.recruitList}/>
						}
					</View>
					<View style={{marginTop:5,backgroundColor:'#fff'}}>
						<View style={{borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}}>
							<Text style={{padding:10,fontSize:16,fontWeight:'bold'}}>租房专栏</Text>
						</View>
						{
							this.state.roomIsLoading?
							<View style={{height:100,justifyContent:'center',alignItems:'center'}}>
								<ActivityIndicator
						          color="#ee735c"
						          size="small"
					        	/>
								<Text style={{fontSize:15,marginTop:10}}>正在努力加载中...</Text>
							</View>
							:
							!this.state.roomIsSuccess ?
							<TouchableOpacity onPress={this._loadRoomData.bind(this)} style={{height:100,justifyContent:'center',alignItems:'center'}}>
								<Text style={{fontSize:15}}>数据加载失败，点击刷新！</Text>
							</TouchableOpacity>
							:
							<GetRecruitItemOrRentItem uid={this.state.userInfo.userid} position={this.state.position} type='rent' navigator={this.props.navigator} dataList={this.state.rentRoomList}/>
						}
					</View>
				</ScrollView>
			</View>
		)
		
	}

}


const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#f3f3f4',
	},
	bar:{
		height:55,
		paddingTop:20,
		backgroundColor:'#ee735c',
		position:'relative',
		top:0,
		flexDirection:'row'
	},
	bar_input:{
		borderRadius:8,
		borderWidth:Util.pixel,
		fontSize:13,
		paddingLeft:10,
		borderColor:'#fff',
		backgroundColor:'#fff',
		height:25,
	},
	bar_betweem:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
	bar_center:{
		flex:5,
		justifyContent:'center',
		alignItems:'center',
	},
	bar_left_text:{
		color:'#fff',
		
	},
	bar_right_text:{
		color:'#fff',
		
		width:35
	}
})