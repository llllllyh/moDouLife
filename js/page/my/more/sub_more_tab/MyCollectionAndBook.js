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
	DeviceEventEmitter
} from 'react-native';

import RecruitDetail from '../../../../page/detail/RecruitDetail';
import RoomDetail from '../../../../page/detail/RoomDetail';
import UserDao from '../../../../expand/dao/userDao';
import GetRecruitItemOrRentItem from '../../../../common/GetRecruitItemOrRentItem';
import Button from 'react-native-button'; 
import Tool from '../../../../util/tool';
import Util from '../../../../util/util';
export default class MyCollectionAndBook extends Component{

	constructor(props){
		super(props);
		this.userDao = new UserDao();
		this.state = {
			dataArr:[],
			position:'',
		}	
	}

	_loadData(type){
		if(type !== 'book'){
			this.userDao.getCollectionRecords(this.props.loginUser.id,'all')
			.then(res => {
				console.log(res)
				this.setState({
					dataArr:res
				});
			})
			.catch((err) => {
				console.log(err)
			})
		}else{
			this.userDao.getBookRoomRecords(0,1)
			.then(response => response.json())
			.then(res => {
				console.log(res)
				this.setState({
					dataArr:res
				});
				
			})
			.catch((err) => {
				console.log(err)
			})
		}
		
	}

	_asyGetPosition(){
		AsyncStorage.getItem('position')
			.then((value) => {
				this.setState({
					position:JSON.parse(value)
				});
			})
	}
	
	_toChooseDetailPage(id,count,isHaveHouse){
		let page;
		if(isHaveHouse){
			page = RoomDetail
		}else{
			page=RecruitDetail
		}

		this.props.navigator.push({
			component:page,
			params:{
				id: id,
				uid:this.props.loginUser.id,
				positionCount:count
			}
		})
	}

	componentDidMount(){
		this._loadData(this.props.type);
		this._asyGetPosition();
		this.listener = DeviceEventEmitter.addListener('checkOutNew',function(type){
			console.log('type=' + type)
			this._loadData(type);
		})
	}

	componentWillUnmount(){  
		this.listener.remove();  
	}

	//此函数用于为给定的item生成一个不重复的key
	 _keyExtractor = (item, index) => item.key = index;

	 _renderItem ({item}) {

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

		return (
			<TouchableOpacity onPress={this._toChooseDetailPage.bind(this,id,count,isHaveHouse)} key={item.key} style={styles.item}> 
				<View>
					{
						item.house || item.type.indexOf('h')>-1 ? <Image style={styles.item_img} source={require('../../../../../res/images/timg.jpeg')}/> : null
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
						<Text style={{color:'red'}}>{money}</Text>
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
					<View style={styles.item_button}>
						<Button style={styles.item_button_btn}>
							{item.checkInStatus.id==1 ? '取消预约' : item.checkInStatus.name}
						</Button>
					</View>
				}
				
			</TouchableOpacity>
		)
	}


	render(){
		return (
			<View style={{flex:1}}>
				<FlatList
					data = {this.state.dataArr}
					renderItem={this._renderItem.bind(this)}
					keyExtractor={this._keyExtractor}
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
		color:'#836FFF'
	}
})


