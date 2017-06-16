import React,{Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	Image,
	AsyncStorage,
	Alert
} from 'react-native';
import MapPage from './MapPage';
import NavigationBar from '../../common/NavigationBar';
import Util from '../../util/util';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import RentRoomDao from '../../expand/dao/rentRoomDao';


import SwiperComponent from '../../common/SwiperComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'react-native-button';
import Toast, {DURATION} from 'react-native-easy-toast';
export default class RoomDetail extends Component{

	constructor(props){
		super(props);
		this.rentRoomDao=new RentRoomDao();
		this.state = {
			banners:[require('../../../res/images/pic/slider_pic_1.jpg'),require('../../../res/images/pic/slider_pic_1.jpg'),require('../../../res/images/pic/slider_pic_1.jpg')],
			isLoading:true,
			isSuccess:false,
			isClikc:false,
			isCollection:false,
			isPayScore:false,
			roomNum:'',
			roomDesc:'',
			roomInfo:{},
			houseConfig:'',
		}
	}

	_pop(){
		this.props.navigator.pop();
	}

	_toMapPage(){
		this.props.navigator.push({
			component:MapPage
		})
	}

	_findHouseConfig(){
		let arrConfig;
		AsyncStorage.getItem('houseConfig')
			.then((value) => {
				if(value){
					arrConfig=JSON.parse(value);
				}else{
					this.rentRoomDao.getAllHouseConfig()
						.then(res => res.json()).then(json=> {
							arrConfig=JSON.parse(json);
						})
				}
			})
			.catch((error)=>{
				console.log('error')
			})
			.then(function(){
				this.setState({
					houseConfig:arrConfig
				});
			}.bind(this))

		
							
	}

	componentDidMount(){
		this._getRoomData(false);
		this._findHouseConfig();
		
	}

	_payScore(score,uid){
		 Alert.alert(
                '提示',
                '要预约该租房吗？'+'\n'+'（此操作将会扣除对应的积分）',
                [
                    {
                        text: '否', onPress: () => {
                        	this.refs.toast.show('已取消该操作！');
                    	}
                    }, {
                    	text: '是', onPress: () => {
                    		RCTDeviceEventEmitter.emit('checkOutNew','book');
                        	this._deductScore(score,uid);
                    	}
                	}
                ]
            )
	
	}

	_deductScore(score,uid){
		this.rentRoomDao.payScoreOrderRoom(score,uid)
			.then(res =>{
				if(res.ok){
					let user = {};
					user.score = score;
					RCTDeviceEventEmitter.emit('changeUser',user);  
					this.setState({isPayScore:true});
				}else{
					this.refs.toast.show('你的积分不足！');
					return;
				}
				
			})
			.catch((error)=>{
				this.refs.toast.show('请检查你的网络连接是否正确！');
				return;
			})
	}



	_findThisRoomIsPay(){
		this.rentRoomDao.findThisRoomIsPay(this.state.roomInfo.id)
			.then(res => res.json()).then(json=> {
				if(json === 1 || json === 3){
	                this.setState({
	                    isPayScore:true
	                });
	            }else{
	                this.setState({
	                    isPayScore:false
	                });
	            }
         	})
         	.catch((error) => {
         		console.log(error)
         	})
	}

	_findThisIsCollection(){
		this.rentRoomDao.findRoomIsCollection(this.state.roomInfo.id,this.props.uid)
			.then(res => {
				try{
                    if(res[0].id !== undefined){
                        this.setState({isCollection:true});
                    }
                }catch (ex){
                    this.setState({isCollection:false});
                }
			})
	}

	_addAndCancelCollection(){
		if(!this.state.isSuccess){
			return;
		}
		if(!this.state.isCollection){
			 let collectionCondition = {
                "serialNumber" : "H" + this.state.roomInfo.id,
                "type" : "h"+this.state.roomInfo.typeId,
                "img" : this.state.roomInfo.smallImageFileName,
                "title" : this.state.roomInfo.title,
                "address" : this.state.roomInfo.address,
                "moneyDesc" : this.state.roomInfo.rent + "元/月",
                "longitude" : this.state.roomInfo.longitude,
                "latitude" : this.state.roomInfo.latitude,
                "userId" :+this.props.uid,
                "createTime" : null
            };
           	try{
            	this.rentRoomDao.saveRoomCollection(collectionCondition)
            	this.setState({
            		isCollection:true
            	});
            	this.refs.toast.show('收藏成功！');
            	RCTDeviceEventEmitter.emit('checkOutNew','collection');
            	return;
            }catch(error){
            	this.refs.toast.show('收藏失败，请稍后再试！');
            	return;
            }
		}else{
        	try{
        		this.rentRoomDao.cancelRoomCollection(this.state.roomInfo.id,this.props.uid)
        		this.setState({
            		isCollection:false
            	});
            	this.refs.toast.show('取消成功！');
            	RCTDeviceEventEmitter.emit('checkOutNew','collection');
            	return;
        	}catch(error){
        		this.refs.toast.show('取消失败，请稍后再试！');
            	return;
        	}
        }
	}


	_getRoomData(flag){
		if(flag){
			this.setState({isClikc:true});
		}else{
			this.setState({isLoading:true,isSuccess:false});
		}
		let self = this;	
		this.rentRoomDao.getRentRoomDetail(this.props.id)
			.then(res => {
				if(res){
					let num;
					let name;
					try{
						num=res.houseRoomNum.name;
						name=res.houseSituation.name;
					}catch(e){
						num='暂无介绍';
						name='暂无介绍';
					}

					this.setState({
						roomInfo:res,
						roomNum: num ,
						roomDesc:name,
					},function(){
						self._findThisRoomIsPay();
						self._findThisIsCollection();
					});
				}else{
					this.refs.toast.show('数据获取失败，请稍后再试！');
					this.setState({isLoading:false,isSuccess:false,isClikc:false});
					return;
				}
			})
			.then(function(){
				setTimeout(function(){
					self.setState({
						isLoading:false,
						isSuccess:true,
						isClikc:false
					});
				},50)
			})
			.catch((error) => {
				console.log(error)
				console.log('in')
				self.refs.toast.show('请检查你的网络连接是否正确！');
				self.setState({isLoading:false,isSuccess:false,isClikc:false});
				return;
	
			})
	}



	_renderItem(key,val){
		return(
			<View style={{flexDirection:'row'}}>
				<View style={{flexDirection:'row',flex:1,paddingBottom:5}}>
					<Text style={{fontSize:15,color:'grey'}}>{key[0]}</Text>
					<Text style={{paddingLeft:10}}>{val[0]}</Text>
				</View>
				<View style={{flexDirection:'row',flex:1}}>
					<Text style={{fontSize:15,color:'grey'}}>{key[1]}</Text>
					<Text style={{paddingLeft:10}}>{val[1]}</Text>
				</View>
			</View>
		)
	}

	_renderIconItem(){
		if(!this.state.houseConfig){
			return;
		}
		return(
				<View style={{paddingTop:15}}>
				{
					this.state.houseConfig.map((item,index) => 
						
						<View  key={index} style={{flexDirection:'row'}}>
							<Text style={{fontSize:17,color:'grey',paddingLeft:5}}>
								{item.name}
							</Text>
						</View>
					)
				}
				</View>
			
		)
	}

		// let arr = [{icon:'wifi',title:'宽带'},{icon:'bed',title:'床'},{icon:'camera-retro',title:'洗衣机'}];
		// let arr2 = [{icon:'archive',title:'衣柜'},{icon:'shower',title:'热水器'},{icon:'inbox',title:'沙发'}];
		// let arr3 = [{icon:'desktop',title:'电视'},{icon:'snowflake-o',title:'空调'},{icon:'thermometer-half',title:'暖气'}];
		// let arr4 = [{icon:'sitemap',title:'油烟机'}];

	render(){
		let info = this.state.roomInfo;
		
		if(!info){
			return <View/>
		}

		return(
			<View style={styles.container}>
				<NavigationBar 
					title='租房详情'
					style={[styles.bar,{marginBottom:this.state.isLoading ? Util.size.height*0.35 :0}]}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
					rightButton={<TouchableOpacity onPress={this._addAndCancelCollection.bind(this)}>{!this.state.isSuccess? null : this.state.isCollection ?  <Icon name='star' size={22} style={{color:'yellow',paddingRight:5}} /> : <Icon name='star-o' size={20} style={{color:'#fff',paddingRight:5}} />}</TouchableOpacity>}
				/>
				<ScrollView alwaysBounceVertical={false} bounces={false}>
					
					{
						this.state.isClikc ?
						<View style={{flex:1,height:Util.size.height*0.8,paddingTop:Util.size.height*0.4,alignItems:'center'}}>
							<Text style={{fontSize:16}}>数据加载中...</Text>
						</View>
						:	
						this.state.isLoading?
							<ActivityIndicator
					          color="#ee735c"
					          size="large"
					        />
						:
						!this.state.isSuccess?
						<TouchableOpacity onPress={this._getRoomData.bind(this,true)} style={{flex:1,height:Util.size.height*0.8,paddingTop:Util.size.height*0.4,alignItems:'center'}}>
							<Text style={{fontSize:16}}>数据加载失败，点击刷新！</Text>
						</TouchableOpacity>
						:
						<View>
							<SwiperComponent banners={this.state.banners}/>
							<View style={{backgroundColor:'#fff',padding:15}}>
								<Text style={{fontSize:16,marginBottom:6}}>{info.title}</Text>
								<Text style={{fontSize:16,marginBottom:6,color:'red'}}>{info.rent} 元/月</Text>
								<Text style={{fontSize:15,marginBottom:6}}>{this.props.positionCount}</Text>
							</View>
							<View style={{marginTop:10,backgroundColor:'#fff',padding:15}}>
								
								{this._renderItem(['厅室','面积'],[this.state.roomNum,info.area+'m²'])}
								{this._renderItem(['装修','概况'],[info.decoration,this.state.roomDesc])}
								{this._renderItem(['楼层','朝向'],[info.floor,info.orientation])}
								<TouchableOpacity onPress={this._toMapPage.bind(this)} style={{borderBottomWidth:Util.pixel,borderTopWidth:Util.pixel,paddingTop:20,paddingBottom:20,borderColor:'#D1D1D1',marginTop:10,flexDirection:'row',alignItems:'center'}} >
									<Text style={{fontSize:16,flex:5}}>
										{info.address}
									</Text>
									<View style={{flex:1,alignItems:'center'}}>
										<Icon name='map-marker' size={22} style={{color:'#ee735c'}}/>
									</View>
								</TouchableOpacity>
							</View>
							<View style={{backgroundColor:'#fff',marginTop:10,padding:15}}>
								<View style={{flexDirection:'row',alignItems:'center'}}>
									<Icon name='comments' size={22} style={{color:'#ee735c'}}/>
									<Text style={{fontSize:16,color:'grey',paddingLeft:10}}>房源描述</Text>
								</View>
								<View style={{marginTop:15}}>
									<Text style={{fontSize:16}}>
										{info.description}
									</Text>

								</View>
							</View>
						</View>
					}
				</ScrollView>
				{
					!this.state.isSuccess ?
					<View/>
					:
					<View style={{flexDirection:'row',height:Util.size.height*0.07}}>
						<View style={{backgroundColor:'#CD2626',flex:3,justifyContent:'center',alignItems:'center'}}> 
							{
								this.state.isPayScore ?
								<TouchableOpacity>
									<Text style={{fontSize:14,padding:2,color:'#fff'}}>{info.landlordName}：{info.landlordPhone}</Text>
								</TouchableOpacity>
								:
								<TouchableOpacity onPress={this._payScore.bind(this,info.needScore,info.id)}>
									<Text style={{fontSize:14,padding:2,color:'#fff'}}>点击免费预约看房，若不满意请在个人中心-更多-租房预约中取消预约</Text>
								</TouchableOpacity>
							}
						</View>
						{
							this.state.isPayScore ?
							<View/>
							:
							<View style={{backgroundColor:'#008B00',flex:1}}> 
								<TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
									<Text style={{fontSize:15,color:'#fff'}}>打赏</Text>
								</TouchableOpacity>
							</View>
						}
					</View>
				}
				
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
		backgroundColor:'#f3f3f4',
	},
	bar:{
		backgroundColor:'#ee735c',
	},
	bar_btn:{
		color:'#fff',
		fontSize:15,
		paddingLeft:5,
		paddingRight:5,
		fontWeight:'bold'
	},
});