import React , {Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	Image,
	TouchableOpacity,
	AsyncStorage,
	ActivityIndicator,
	DeviceEventEmitter,
	Alert
} from 'react-native';

import RecruitDetail from '../../../../page/detail/RecruitDetail';
import RoomDetail from '../../../../page/detail/RoomDetail';
import UserDao from '../../../../expand/dao/userDao';
import GetRecruitItemOrRentItem from '../../../../common/GetRecruitItemOrRentItem';
import Button from 'react-native-button'; 
import Tool from '../../../../util/tool';
import Config from '../../../../util/config';
import Util from '../../../../util/util';
import ArrayTool from '../../../../util/arrayTool';
import Toast, {DURATION} from 'react-native-easy-toast';
export default class MyCollectionAndBook extends Component{

	constructor(props){
		super(props);
		this.userDao = new UserDao();
		this.state = {
			collectionArr:[],
			bookArr:[],
			position:'',
			isLoading:false,
			isRefreshing:false,
			isSuccess:false
		}	
	}

	_closeRefreshing(self){
		setTimeout(function(){
			self.setState({
				isRefreshing:false
			});
		},100)
	}

	_loadCollectionRecords(){
		this.setState({isLoading:false,isRefreshing:true});
		let self = this;
		let type = ArrayTool.getChoiceTypeById(this.props.choiceCId);
		this.userDao.getCollectionRecords(this.props.loginUser.id,type ? type : 'all')
			.then(res => {
				this.refs.toast.show('加载成功！');
				this.setState({
					collectionArr:res,
					
				},function(){
					self._closeRefreshing(self);
				}.bind(this));
			})
			.catch((err) => {
				self._closeRefreshing(self);
				this.refs.toast.show('加载失败！');
				console.log(err)
			})
	}


	_loadBookRecords(){
		this.setState({isRefreshing:true});
		let self = this;
		this.userDao.getBookRoomRecords(this.props.choiceBId,1)
			.then(res => {
				this.refs.toast.show('加载成功！');
				this.setState({
					bookArr:res,
				},function(){
					self._closeRefreshing(self);
				}.bind(this));
			})
			.catch((err) => {
				self._closeRefreshing(self);
				this.refs.toast.show('加载失败！');
				console.log(err)
			})
	}

	_loadDataByType(type,isNet,value){
		if(isNet){
			if(type !== 'book'){
				this._loadCollectionRecords();
			}else{
				this._loadBookRecords();
			}
		}else{
			
			if(type !== 'book'){
				this.setState({
					collectionArr:JSON.parse(value)
				});
			}else{
				let data = JSON.parse(value)
				this.setState({
					bookArr:data
				})
			}
		}
		
	}

	_loadData(type){
		let record ;
		if(type !== 'book'){
			record = 'collectionRecords';
		}else{ 
			record = 'bookRecords';
		}
		AsyncStorage.getItem(record)
			.then((value) => {
				if(value){
					this._loadDataByType(type,false,value);
				}else{
					this._loadDataByType(type,true,null);
				}
				
			})
			.catch((error) => {
				this._loadDataByType(type,true,null);
			})
		
	}

	_asyGetPosition(){
		AsyncStorage.getItem('position')
			.then((value) => {
				this.setState({
					position:JSON.parse(value)
				},() => {
					this._loadBookRecords();
					this._loadCollectionRecords();
				});
			})
			.then(() => {
				this._loadData(this.props.type);
			});
	}
	
	_toChooseDetailPage(id,count,isHaveHouse,type,money){
		let page;
		let pageType = 'home';
		if(isHaveHouse){
			page = RoomDetail
		}else{
			if(type === 'r1'){
				pageType = 'all'
			}else{
				pageType = 'part'
			}
			page=RecruitDetail
		}

		this.props.navigator.push({
			component:page,
			params:{
				id: id,
				uid:this.props.loginUser.id,
				positionCount:count,
				pageType:pageType,
				money:money
			}
		})
	}

	_cancelBook(rid){
		Alert.alert(
			'提示',
			'是否取消该房族预约？',
			[
				{
					text:'否'
				},
				{
					text:'是',onPress:()=>{
						this._cancelOper(rid);
					}
				}
			]
		)
		
	}

	_cancelOper(rid){
		this.userDao.cancelBookOper(rid)
			.then(res => {
				this.refs.toast.show('取消预约成功！');
				this._loadBookRecords();
			})
			.catch((error) => {
				this.refs.toast.show('取消预约失败！');
			});
	}

	componentDidMount(){
		this._asyGetPosition();
		this.listener = DeviceEventEmitter.addListener('checkOutNew',function(type){
			this.setState({isRefreshing:true});
			if(type === 'collection'){
				this._loadCollectionRecords();
			}else{
				this._loadBookRecords();
			}

		}.bind(this))
	}

	componentWillUnmount(){  
		this.listener.remove();  
	}

	//此函数用于为给定的item生成一个不重复的key
	 _keyExtractor = (item, index) => item.key = index;

	 _renderItem ({item}) {
	 	let base = Config.api.base.substring(0,Config.api.base.indexOf('/weixin'));
	 	let title = item.house ? item.house.title : item.title;
	 	let address = item.house ? item.house.address : item.address;
	 	let money = item.house ? item.house.rent+'元/月' : item.moneyDesc ? item.moneyDesc : '详谈';
	 	let size = !item.checkInStatus ? (item.type.indexOf('h')>-1 ? 10 :13) :6;
	 	let position2 = {};
	 	position2.latitude = item.house ? item.house.latitude : item.latitude;
	 	position2.longitude = item.house ? item.house.longitude : item.longitude;
	 	let count = this.state.position.latitude ? Tool.getGreatCircleDistance(this.state.position,position2) : '未知';
	 	let isHaveHouse ;
	 	try{
	 		isHaveHouse = item.house ? true : item.type.indexOf('h')>-1 ? true : false;
	 	}catch(e){
	 		isHaveHouse = false;
	 	}
	 	let id = item.house ? item.house.id : item.serialNumber.substring(1);
	 	console.log(base+'/houseImages/smallImages/'+item.smallImageFileName)
		return (
			<TouchableOpacity onPress={this._toChooseDetailPage.bind(this,id,count,isHaveHouse,item.type,money)} key={item.key} style={styles.item}> 
				<View>
					{
						item.house || item.type.indexOf('h')>-1 ? <Image style={styles.item_img} source={{uri:base+'/houseImages/smallImages/'+item.img}} /> : null
					}
				</View>
				<View style={{flex:1}}>
					<Text style={styles.item_title}>
						{title}
					</Text>
					<Text style={styles.item_address}>
						{address.length>=size ? address.substring(0,size)+'...' : address }
					</Text>
					<View style={styles.item_bottom}>
						<Text style={{color:'red'}}>{money.length <16 ? money : money.substring(0,16)+'...'}</Text>
						{
							!item.checkInStatus ?
							<Text style={{color:'grey'}}>
							{count}
							</Text>
							:null
						}
					</View>
				</View>
				{
					!item.checkInStatus ?
					null
					:
					item.checkInStatus.id!==1 ?
					<View style={[styles.item_button,{backgroundColor:'#D1D1D1'}]}>
						<Text style={{width:55,lineHeight:45,fontSize:16,height:50,textAlign:'center'}}>{item.checkInStatus.name}</Text>
					</View>
					:
					<View style={styles.item_button}>
						<Button style={styles.item_button_btn} onPress={this._cancelBook.bind(this,item.id)}>
							取消预约
						</Button>
					</View>
					
					
				}
				
			</TouchableOpacity>
		)
	}


	render(){	
		let dataArr = this.props.type === 'book' ? this.state.bookArr : this.state.collectionArr;
		try{
			dataArr.length
		}catch(e){
			dataArr = [];
		}
		return (
			<View style={{flex:1}}>
			{
				this.state.isLoading ?
				<View style={styles.fail}>
					<ActivityIndicator
				          color="#ee735c"
				          size="large"
				        />
				</View>
				:
				dataArr.length<=0 ?
				<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
					<Text style={{fontSize:16}}>暂无记录</Text>
				</View>
				:
				<FlatList
					data = {dataArr}
					renderItem={this._renderItem.bind(this)}
					keyExtractor={this._keyExtractor}

					refreshControl = {
						<RefreshControl 
							refreshing={this.state.isRefreshing}
							onRefresh={this._loadDataByType.bind(this,this.props.type,true,null)}
							colors={['#ee735c']}
							tintColor='#ee735c'
							title='刷新数据中...'
							titleColor='#ee735c'
						/>
					}
				/>
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
	item:{
		padding:10,
		flexDirection:'row',
		borderBottomWidth:Util.pixel,
		borderColor:'#D1D1D1'
	},
	item_img:{
		height:60,
		width:100,
		resizeMode:'stretch',
		marginRight:5
	},
	item_title:{
		fontSize:16,
		paddingBottom:3,
		width:Util.size.width*0.4,
		height:18,
		overflow:'hidden'
	},
	item_address:{
		fontSize:15,
		color:'grey',
		paddingBottom:3
	},
	item_bottom:{
		flexDirection:'row',
		justifyContent:'space-between'
	},
	item_button:{
		justifyContent:'center',
		borderWidth:1,
		borderRadius:5,
		backgroundColor:'#FFFAFA',
		borderColor:'#D1D1D1'
	},
	item_button_btn:{
		width:55,
		padding:7,
		height:50,
		lineHeight:18,
		color:'#836FFF',

	},
	fail:{
		paddingTop:Util.size.height*0.35,
		flex:1,
		alignItems:'center'
	}
})


