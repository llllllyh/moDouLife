import React,{Component} from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Modal,
	FlatList,
	ActivityIndicator
} from 'react-native';
import GetRecruitItemOrRentItem from '../../../common/GetRecruitItemOrRentItem';
import NavigationBar from '../../../common/NavigationBar';
import Util from '../../../util/util';
import ArrayTool from '../../../util/arrayTool';
import Icon from 'react-native-vector-icons/FontAwesome';
import RentRoomDao from '../../../expand/dao/rentRoomDao';
import Picker from 'react-native-picker';
import SubPicker from '../../../common/SubPicker';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ChoiceFilter from '../../../common/ChoiceFilter';
var cachedResults = {
  nextPage:1,
  items:[],
}

export default class DetailRentMenuPage extends Component{
	constructor(props){
		super(props);
		this.rentRoomDao = new RentRoomDao();
		this.state = {
			isLoading:true,
			houseConfig:[],
			checkedConfig:[],
			choiceArea:'全广州市',
			choiceSort:'默认排序',
			choiceSortIndex:0,
			choicePrice:'租金不限',
			choiceDate:'不限结算',
			choiceDateIndex:0,
			choiceRoomNum:'厅室不限',
			choiceRoomNumIndex:0,
			roomNumType:[],
			choiceConfig:[],
			resultData:[],
			isHasMore:true,
			pageType:'',
			dataList:[],
			dataListType:'',
			filterStr:0
		}
	}



	_pop(){
		cachedResults.nextPage = 1;
		cachedResults.items=[]
		this.props.navigator.pop();
	}

	_choiceDataList(type){
		let dataList;
		if(type === 'area'){
			dataList = ['全广州市','荔湾区','越秀区','海珠区',
						'天河区','白云区','黄埔区','番禺区','花都区',
						'南沙区','从化区','增城区']
		}else if(type === 'sort'){
			dataList = ['默认排序','离我最近','最近发布']
		}else if(type === 'price'){
			dataList = ['租金不限','600以下','600-1000',
			'1000-1500','1500-2000','2000-3000',
			'3000-5000','5000-8000','8000以上']
		}else if(type === 'room'){
			dataList = this.state.roomNumType
		}else{
			RCTDeviceEventEmitter.emit('isModalShow',true);
			return;
		}
		
    	this.setState({
    		dataList:dataList,
    		dataListType:type
    	},()=>{
    		RCTDeviceEventEmitter.emit('isPickerShow',true);
    	});
	}

	addCheckConfig(arr){
		this.setState({
			checkedConfig:arr
		});
	}

	loadFilterData(){
		cachedResults.items=[];
		cachedResults.nextPage=1;
		let str = ArrayTool.getFilterStr(this.state.houseConfig,this.state.checkedConfig)
		this.setState({
			filterStr:str,
			isLoading:true
		},()=>{
			this._loadData(this.state.pageType)
		});
	}

	choiceOper(type,data){
		let index = 0;
    	if(type === 'sort' || type === 'room'){
    		index = this.state.dataList.findIndex((item) => item === data[0])
    	}
    	if(type === 'area'){
    		this.setState({choiceArea:data[0]});
    	}else if(type === 'sort'){
    		this.setState({choiceSort:data,choiceSortIndex:index});
    	}else if(type === 'price'){
    		this.setState({choicePrice:data[0]});
    	}else if(type === 'room'){
			this.setState({choiceRoomNum:data,choiceRoomNumIndex:index});
    	}
    	cachedResults.items=[];
		cachedResults.nextPage=1;
		this.setState({isLoading:true});
    	this._loadData(this.state.pageType);
	}

	_loadRoomNum(){
		this.rentRoomDao.getRoomNumType()
			.then(res => {
				res.push({id:0,name:'厅室不限'});
				let roomNumType = res.reverse();
				let type = [];
				for(let item in roomNumType){
					type.push(roomNumType[item].name);
				}
				this.setState({
					roomNumType:type
				});
			})
	}

	componentDidMount(){
		let type ;
		let title = this.props.title;
		if(title === '长租房'){
			type = 'long';
			this._loadHouseConfig();
		}else if(title === '月租房'){
			type = 'month'
		}else{
			type = 'day'
		}
		this.setState({pageType:type});
		this._loadRoomNum();
		this._loadData(type);
	
	}


	_loadHouseConfig(){
		this.rentRoomDao.getAllHouseConfig()
			.then(json=> {
				this.setState({
					houseConfig:json
				});
			})
			.catch((error) => {
				console.log(error)
			})
	}

	_fetMore(){
		if(!this.state.isHasMore){
			return;
		}
		setTimeout(()=>{
			this._loadData(this.state.pageType);
    	},50)
	}

	_loadData(type){
		let minRent;
		let maxRent;
		this.setState({isShowPicker:false});
		if(type === 'long'){
			let str = this.state.choicePrice
			if (str.indexOf("-") > -1) {
                minRent = str.substr(0, str.indexOf("-"));
                maxRent = str.substr(str.indexOf("-") + 1, str.length);
            }else if(str==="600以下"){
                minRent=0;
                maxRent=599;
            }else if(str==="8000以上"){
                minRent=8000;
                maxRent=0;
            }else{
            	minRent=0;
            	maxRent=0;
            }
		}
		let houseCondition = {
            sortType:this.state.choiceSortIndex,
            typeId:this.props.typeId,
            regionName:this.state.choiceArea !== '全广州市' ? this.state.choiceArea:'',
            pageNum:cachedResults.nextPage,
            pageSize:10,
            longitude:this.props.position.longitude,
            latitude:this.props.position.latitude
        }
        if(type === 'long'){
        	houseCondition.minRent = minRent;
        	houseCondition.maxRent = maxRent;
        	houseCondition.config = this.state.filterStr;
        	houseCondition.roomId = this.state.choiceRoomNumIndex;
        }
        console.log(houseCondition)
        this.rentRoomDao.getRoomDataList(houseCondition,type)
        	.then(json => {
        		
            	cachedResults.nextPage += 1;
            	let items = cachedResults.items.slice();
            	items = items.concat(json);
            	cachedResults.items = items;
        		this.setState({
        			resultData:items,
        			isLoading:false
        		},()=>{
        			if(json.length<houseCondition.pageSize){
						this.setState({isHasMore:false,isLoading:false});
					}
        		});
        		
        	})
	}

	//此函数用于为给定的item生成一个不重复的key
	 _keyExtractor = (item, index) => item.key = index;

	 _renderItem ({item}) {
	 	let data = [];
	 	let moneyType = this.state.pageType === 'day' ? 'day' : undefined;
	 	data.push(item)
		return(
			<GetRecruitItemOrRentItem moneyType={moneyType} position={this.props.position} uid={this.props.userInfo.userid} type='rent' navigator={this.props.navigator} dataList={data}/>
		)
	}
	//提取
	footerChomponent(){
    	return (
    		<View style={{marginTop:10,alignItems:'center'}}>
    			{

					this.state.isHasMore ?
					 <ActivityIndicator size='large' color='#ee735c' style={styles.loadingMore} />
    				:
    				<Text style={{fontSize:15,marginVertical:20,color:'grey'}}>没有更多了</Text>
    			}
	        </View>
    	)
    }

	_renderHeaderMenuItem(title,icon,type){
		return(
			<TouchableOpacity onPress={this._choiceDataList.bind(this,type)} style={{flex:1,orderRightWidth:1,alignItems:'center',borderColor:'#D1D1D1',justifyContent:'center'}}>
  				<Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize:14,}}>{title}<Icon size={15} color='#D1D1D1' name={icon}/></Text>
  			</TouchableOpacity>
		)
	}

	render(){
		return (
			<View style={{flex:1,backgroundColor:'#fff'}}>
				<NavigationBar title={this.props.title} leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}/>
          		<View style={styles.headerBar}>
					{this._renderHeaderMenuItem(this.state.choiceArea,'caret-down','area')}
					{this._renderHeaderMenuItem(this.state.choiceSort,'caret-down','sort')}
					{this.state.pageType ==='long' ? this._renderHeaderMenuItem(this.state.choicePrice,'caret-down','price'):null}
					{this.state.pageType ==='long' ? this._renderHeaderMenuItem(this.state.choiceRoomNum,'caret-down','room'):null}
					{this.state.pageType ==='long' ? this._renderHeaderMenuItem(this.state.checkedConfig.length<=0 ?'筛选' :this.state.checkedConfig,'sliders'):null}
          		</View>
          		{
          			this.state.isLoading ?
          			<View style={{flex:1,justifyContent:'center'}}>
						<ActivityIndicator size='large' color='#ee735c'/>
          			</View>
          			:
	          		<FlatList
			            data = {this.state.resultData}
			           	renderItem={this._renderItem.bind(this)}
			           	keyExtractor={this._keyExtractor}
			           	ListFooterComponent = {this.footerChomponent.bind(this)}
			           	onEndReached={this._fetMore.bind(this)}
			           	onEndReachedThreshold={0.3}
			        />
		    	}
		        <SubPicker 
          		 dataListType={this.state.dataListType} 
          		 dataList={this.state.dataList} 
          		 isShowPicker={this.state.isShowPicker} 
          		 choiceOper={this.choiceOper.bind(this)}/>
          		  <ChoiceFilter loadFilterData={this.loadFilterData.bind(this)} addCheckedList={this.addCheckConfig.bind(this)} configList={this.state.houseConfig} checkedList={this.state.checkedConfig}/>
          	
			</View>
		)
	}
}

const styles = StyleSheet.create({
	bar_btn:{
		color:'#fff',
		fontSize:15,
		paddingLeft:5,
		paddingRight:5,
		fontWeight:'bold'
	},
	headerBar:{
		borderBottomWidth:Util.pixel,
		height:40,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        borderColor:'#D1D1D1'
	},
	line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    loadingMore:{
    	marginVertical:20,
  	},
})
