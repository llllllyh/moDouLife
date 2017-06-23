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
import Icon from 'react-native-vector-icons/FontAwesome';
import RentRoomDao from '../../../expand/dao/rentRoomDao';
import Picker from 'react-native-picker';



var cachedResults = {
  nextPage:1,
  items:[],
}

export default class DetailRentMenuPage extends Component{
	constructor(props){
		super(props);
		this.rentRoomDao = new RentRoomDao();
		this.state = {
			isShowModal:false,
			isShowPicker:true,
			isLoading:true,
			houseConfig:[],
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
			pageType:''
		}
	}

	_pop(){
		cachedResults.nextPage = 1;
		cachedResults.items=[]
		this.props.navigator.pop();
	}

	_cancelPicker(){
		this.setState({isShowModal:false,isShowPicker:true});
		Picker.hide();
	}


	_pickShow(type){
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
			
		}
		Picker.init({
        pickerData:dataList,
        pickerConfirmBtnText:'确认筛选',
		pickerCancelBtnText:'取消筛选',
		pickerTitleText:'筛选条件',
		pickerFontSize:20,
        onPickerConfirm: data => {
        	let index = 0;
        	if(type === 'sort' || type === 'room'){
        		index = dataList.findIndex((item) => item === data[0])
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
        	this._loadData(this.state.pageType);
        	this._cancelPicker();
        },
        onPickerCancel: data => {
        	this._cancelPicker();
        },
    });
		this.setState({
        		isShowModal:true,
        		isShowPicker:true
        });
	    Picker.show();
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
		}else if(title === '月租房'){
			type = 'month'
		}else{
			type = 'day'
		}
		this.setState({pageType:type});
		this._loadRoomNum();
		this._loadData(type);
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
        	houseCondition.config = '';
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
        			resultData:items
        		},()=>{
        			if(json.length<houseCondition.pageSize){
						this.setState({isHasMore:false});
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
		let itemTitle = title+'';
		return(
			<TouchableOpacity onPress={this._pickShow.bind(this,type)} style={{flex:1,borderRightWidth:1,alignItems:'center',borderColor:'#D1D1D1'}}>
  				<Text style={{fontSize:14}}>{itemTitle.length>3 ? itemTitle.substring(0,3)+'..' :itemTitle } <Icon size={15} color='#D1D1D1' name={icon}/></Text>
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
					{this._renderHeaderMenuItem(this.state.choicePrice,'caret-down','price')}
					{this._renderHeaderMenuItem(this.state.choiceRoomNum,'caret-down','room')}
					{this._renderHeaderMenuItem('筛选','sliders')}
          		</View>
          		<FlatList
		            data = {this.state.resultData}
		           	renderItem={this._renderItem.bind(this)}
		           	keyExtractor={this._keyExtractor}
		           	ListFooterComponent = {this.footerChomponent.bind(this)}
		           	onEndReached={this._fetMore.bind(this)}
		           	onEndReachedThreshold={0.3}
		        />
          		<Modal 
          			animationType={'fade'}
					transparent={true}
					visible={this.state.isShowModal}>
					<Text onPress={this._cancelPicker.bind(this)} style={{flex:1,backgroundColor:'black',opacity:0.2}} />
					{
						this.state.isShowPicker ?
						null
          				:
          				<View style={{backgroundColor:'#fff',width:Util.size.width*0.8,
						margin:Util.size.width*0.1,top:Util.size.height*0.2
          				,position:'absolute'}}>
          					 {this.renderView()}
          					{/*<Button style={{padding:5,backgroundColor:'#ee735c',color:'#fff'}}>确定</Button>*/}
          				</View>
					}
					
          		</Modal>
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
		height:35,
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
