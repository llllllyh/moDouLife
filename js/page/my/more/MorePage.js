import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Modal,

} from 'react-native';


import ScoreRecord from './sub_more_tab/ScoreRecord';
import MyCollectionAndBook from './sub_more_tab/MyCollectionAndBook';
import Button from 'react-native-button';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import NavigationBar from '../../../common/NavigationBar';
import Picker from 'react-native-picker';
import ArrayTool from '../../../util/arrayTool';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import RentRoomDao from '../../../expand/dao/rentRoomDao';
export default class MorePage extends Component{

	constructor(props){
		super(props);
		this.rentRoomDao = new RentRoomDao();
		this.state = {
			isShowModal:false,
			choiceData:['全部','全部招聘','全职','兼职','全部租房','日租房','月租房','长租房'],
			collectionChoice:{name:'全部',index:0},
			bookChoice:{name:'全部',index:0},
			scoreChoice:{name:'全部',index:0},
			showChoice:'全部',
			tabIndex:0
		}

	}



	_pop(){
		this.props.navigator.jumpBack();
	}

	_cancelPicker(){
		this.setState({isShowModal:false});
		Picker.hide();
	}

	_pickShow(){
		Picker.init({
        pickerData: this.state.choiceData,
        pickerConfirmBtnText:'确认筛选',
		pickerCancelBtnText:'取消筛选',
		pickerTitleText:'筛选条件',
		pickerFontSize:20,
        selectedValue: [this.state.showChoice],
        onPickerConfirm: data => {
        	let arr = ArrayTool.getObjByArray(this.state.choiceData,data);
        	this.setState({isShowModal:false,showChoice:data,showChoice:arr.name});
        	if(this.state.tabIndex === 0){
        		this.setState({collectionChoice:arr},function(){
        			RCTDeviceEventEmitter.emit('checkOutNew','collection')
        		}.bind(this));
        		
        	}else if(this.state.tabIndex === 1){
        		this.setState({bookChoice:arr},function(){
        			RCTDeviceEventEmitter.emit('checkOutNew','book');
        		}.bind(this));
        		
        	}else{
        		this.setState({scoreChoice:arr},function(){
        			RCTDeviceEventEmitter.emit('changeChoiceScore');
        		}.bind(this));
        	}
        },
        onPickerCancel: data => {
        	this.setState({isShowModal:false});
        },
    });
	this.setState({isShowModal:true});
    Picker.show();

	}

	_changeTab(index){
		let arr = [];
		let show = '';
		if(index === 0){
			show = this.state.collectionChoice.name;
			arr = ['全部','全部招聘','全职','兼职','全部租房','日租房','月租房','长租房'];
		}else if(index === 1){
			show = this.state.bookChoice.name;
			arr = ['全部','已预约','已入住','申请中','已退积分','拒退积分'];
		}else{
			show = this.state.scoreChoice.name;
			arr = ['全部','获取积分','使用积分']
		}
			
		this.setState({
			choiceData:arr,
			showChoice:show,
			tabIndex:index
		});		
	}
	

	render(){
		let content = <ScrollableTabView 
						tabBarInactiveTextColor='mintcream'
						tabBarActiveTextColor='#ee735c'
						tabBarBackgroundColor='#fff'
						tabBarInactiveTextColor='grey'
						tabBarUnderlineStyle={{backgroundColor:'#ee735c',height:2}}
						onChangeTab={(obj) => {
						  	this._changeTab(obj.i);
				        }}
						renderTabBar={() => <ScrollableTabBar/>}
					  >
						<MyCollectionAndBook choiceCId = {this.state.collectionChoice.index} loginUser={this.props.loginUser} type='collection' navigator={this.props.navigator} tabLabel='我的收藏'/>
					    <MyCollectionAndBook choiceBId = {this.state.bookChoice.index} loginUser={this.props.loginUser} type='book' navigator={this.props.navigator} tabLabel='租房预约'/>
					   	<ScoreRecord choiceSId = {this.state.scoreChoice.index} navigator={this.props.navigator} tabLabel='积分纪录'/>
					</ScrollableTabView>
		return(
			<View style={styles.container}>
				<NavigationBar
					title='更多信息'
					style={styles.bar}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
					rightButton = {<TouchableOpacity onPress={this._pickShow.bind(this)}><Text style={{backgroundColor:'#fff',fontSize:14,paddingHorizontal:5,paddingVertical:5,color:'#ee735c',marginRight:10}}>当前:{this.state.showChoice}</Text></TouchableOpacity>}
				/>
			 	
				{content}
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.isShowModal}
				>
				<Text style={{flex:1,backgroundColor:'black',opacity:0.2}} onPress={this._cancelPicker.bind(this)}/>
				</Modal>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#fff'
	},
	header_bar:{
		paddingTop:14,
		backgroundColor:'#ee735c'
	},
	bottom_bar:{
		justifyContent:'center',
		backgroundColor:'#ee735c',
	},
	bottom_bar_btn:{
		fontSize:16,
		padding:10,
		color:'#fff',
	},
	bar:{
		backgroundColor:'#ee735c',
	},
	bar_btn:{
		color:'#fff',
		fontSize:18,
		paddingVertical:10,
		paddingHorizontal:5,
		fontWeight:'bold'
	},
})