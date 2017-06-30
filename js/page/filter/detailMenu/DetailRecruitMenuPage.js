import React , {Component} from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Modal,
	AsyncStorage,
	Image,
	FlatList,
	ActivityIndicator
} from 'react-native';
import GetRecruitItemOrRentItem from '../../../common/GetRecruitItemOrRentItem';
import HomePage from '../../HomePage';
import Button from 'react-native-button';
import CheckBox from 'react-native-check-box';
import NavigationBar from '../../../common/NavigationBar';
import Util from '../../../util/util';
import RentRoomDao from '../../../expand/dao/rentRoomDao';
import RecruitDao from '../../../expand/dao/recruitDao';
import Icon from 'react-native-vector-icons/FontAwesome';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Picker from 'react-native-picker';
import SubPicker from '../../../common/SubPicker';

var cachedResults = {
  nextPage:1,
  items:[],
}

export default class DetailRecruitMenuPage extends Component{

	constructor(props){
		super(props);
		this.rentRoomDao = new RentRoomDao();
		this.recruitDao = new RecruitDao();
		this.state = {
			isLoading:true,
			houseConfig:[],
			choiceArea:'全广州市',
			choiceSort:'默认排序',
			choiceSortIndex:0,
			choiceSalary:'薪资不限',
			choiceDate:'不限结算',
			choiceDateIndex:0,
			choiceConfig:[],
			resultData:[],
			isHasMore:true,
			dataList:[],
			dataListType:'area'
		}
	}

	_pop(){
		cachedResults.nextPage = 1;
		cachedResults.items=[]
		this.props.navigator.pop();
	}

	_renderHeaderMenuItem(title,icon,type){
		let itemTitle = title+'';
		return(
			<TouchableOpacity onPress={this._choiceDataList.bind(this,type)} style={{flex:1,borderRightWidth:1,alignItems:'center',borderColor:'#D1D1D1'}}>
  				<Text style={{fontSize:14,padding:2}}>{itemTitle.length>8 ? itemTitle.substring(0,6)+'..' :itemTitle } <Icon size={15} color='#D1D1D1' name={icon}/></Text>
  			</TouchableOpacity>
		)
	}

	_choiceDataList(type){
		let dataList ;
		if(type === 'area'){
			dataList = ['全广州市','荔湾区','越秀区','海珠区',
						'天河区','白云区','黄埔区','番禺区','花都区',
						'南沙区','从化区','增城区']
		}else if(type === 'sort'){
			dataList = ['默认排序','离我最近','薪金最高','最近发布']
		}else if(type === 'salary' && this.props.dataType === 'all'){
			dataList = ['薪资不限','1000以下','1000-2000','2000-3000',
                '3000-5000','5000-8000','8000-12000','12000-20000'
                ,'20000-25000','25000以上']
		}else{
			dataList = ['不限结算','日','周','月']	
		}
		this.setState({
			dataList:dataList,
			dataListType:type
		},()=>{
			RCTDeviceEventEmitter.emit('isPickerShow',true);
		});
	}

	choiceOper(type,data){
		cachedResults.items=[];
		cachedResults.nextPage=1;
		this.setState({isLoading:true,isHasMore:true});
    	if(type === 'area'){
			this.setState({
				choiceArea:data[0]
    		});
    	}else if(type === 'sort'){

    		let choiceIndex = this.state.dataList.findIndex((currentItem) => currentItem == data);
    		
    		console.log(choiceIndex)
    		this.setState({
				choiceSort:data,
				choiceSortIndex:choiceIndex
    		});
    	}else if(type === 'salary'){
    		this.setState({
				choiceSalary:data
    		});
    	}else{
    		let choiceIndex = this.state.dataList.findIndex((currentItem) => currentItem == data);
    		this.setState({
    			choiceDateIndex:choiceIndex,
				choiceDate:data
    		});
    	}
    	this._loadData(this.props.dataType);
	}


	componentDidMount(){
		this._loadHouseConfig();
		this._loadData(this.props.dataType);	

	}

	_loadHouseConfig(){
		AsyncStorage.getItem('houseConfig')
			.then((value) => {
				if(value){
					this.setState({
						houseConfig:JSON.parse(value)
					},()=>{
						this.renderView();
					});
				}else{
					this.rentRoomDao.getAllHouseConfig()
						.then(res => res.json()).then(json=> {
							houseConfig:json
						})
						.then(()=>{
							this.renderView();
						})
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	
	_toHomeOrMyPage(type){
		if(type!=='home'){
			RCTDeviceEventEmitter.emit('toTabPage','tb_my');
		}
		this.props.navigator.popToTop()
	}

	
	 renderView() {
        if (!this.state.houseConfig || this.state.houseConfig.length === 0)return;
        var len = this.state.houseConfig.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.houseConfig[i])}
                        {this.renderCheckBox(this.state.houseConfig[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.houseConfig[len - 2]) : null}
                    {this.renderCheckBox(this.state.houseConfig[len - 1])}
                </View>
            </View>
        )
        return views;

    }

	_chlickCheckBox(){
		
	}

	

	//此函数用于为给定的item生成一个不重复的key
	 _keyExtractor = (item, index) => item.key = index;

	 _renderItem ({item}) {
	 	let data = [];
	 	data.push(item)
		return(
			<GetRecruitItemOrRentItem pageType={this.props.dataType} position={this.props.position} uid={this.props.userInfo.userid} type='recruit' navigator={this.props.navigator} dataList={data}/>
		)
	}


	_loadData(dataType){
 		let minMoney;
 		let maxMoney;
		if(dataType === 'all'){
			let str = this.state.choiceSalary[0];

			if (str.indexOf("-") > -1) {
                minMoney = str.substr(0, str.indexOf("-"));
                maxMoney = str.substr(str.indexOf("-") + 1, str.length);
            }else if(str=="1000以下"){
               minMoney=0;
               maxMoney=1000;
            }else if(str=="25000以上"){
                minMoney=25000;
                maxMoney=0;
            }else{
                minMoney=0;
                maxMoney=0;
            }

		}

		let recruitmentCondition={
            orderByNumber:this.state.choiceSortIndex,
            regionName:this.state.choiceArea === '全广州市' ? '' : this.state.choiceArea,
            pageNo:cachedResults.nextPage,
            pageSize:10,
            longitude:this.props.position.longitude,
            latitude:this.props.position.latitude
        }
		if(dataType === 'all'){
			recruitmentCondition.industryId =this.props.typeId;
			recruitmentCondition.minMoney = minMoney;
			recruitmentCondition.maxMoney = maxMoney;
			recruitmentCondition.binaryString = 0;
		}else{
			recruitmentCondition.settlementId = this.state.choiceDateIndex;
			recruitmentCondition.pluralityId = this.props.typeId;
		}
		
        console.log(recruitmentCondition)
        this.recruitDao.getDetailRecruitmentList(recruitmentCondition,dataType)
            .then(json =>{
				if(json.length<recruitmentCondition.pageSize){
					this.setState({isHasMore:false});
				}
            	cachedResults.nextPage += 1;
            	let items = cachedResults.items.slice();
            	items = items.concat(json);
            	cachedResults.items = items;
            	this.setState({
            		resultData:cachedResults.items,
					isLoading:false,

            	});
            })
            .catch((error) => {
            	console.log(error)
            })

	}


	renderCheckBox(data) {
        let leftText = data.name;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                isChecked={true}
                leftText={leftText}
                onClick={this._chlickCheckBox.bind(this)}
                checkedImage={<Image source={require('../../../../res/images/ic_check_box.png')}
                				style={{tintColor:'#7AC5CD'}}/>}
                                     
                unCheckedImage={<Image source={require('../../../../res/images/ic_check_box_outline_blank.png')}
                				style={{tintColor:'#7AC5CD'}}/>}
            />);
    }

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

    _fetMore(){
    	if(!this.state.isHasMore){
			return;
    	}
    	setTimeout(()=>{
			this._loadData(this.props.dataType);
    	},50)
    	
    }
    render(){
		return (
			<View style={styles.container}>
				<NavigationBar title={this.props.title} leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}/>
          		<View style={styles.headerBar}>
          			{this._renderHeaderMenuItem(this.state.choiceArea,'caret-down','area')}
          			{this._renderHeaderMenuItem(this.state.choiceSort,'caret-down','sort')}
          			{this.props.dataType !== 'all' ? this._renderHeaderMenuItem(this.state.choiceDate,'caret-down','date') : this._renderHeaderMenuItem(this.state.choiceSalary,'caret-down','salary')}
          			{this.props.dataType !== 'all' ? null :this._renderHeaderMenuItem('筛选','sliders','multi')}
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
          		<View style={styles.footerBar}>
					<TouchableOpacity onPress={this._toHomeOrMyPage.bind(this,'home')} style={styles.footerBar_popBtn}>
						<Icon size={25} color='grey' name='home'/>
						<Text style={{color:'grey'}}>首页</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this._toHomeOrMyPage.bind(this,'my')} style={styles.footerBar_popBtn}>
						<Icon size={25} color='grey' name='user'/>
						<Text style={{color:'grey'}}>个人中心</Text>
					</TouchableOpacity>
					<View style={[styles.footerBar_popBtn,styles.scoreBtn]}>
						<Text style={{textAlign:'center',color:'#fff',fontSize:13,padding:3}}>免积分查看0次，继续查看需要0积分</Text>
					</View>
					<TouchableOpacity style={[styles.footerBar_popBtn,styles.payBtn]}>
						<Text style={{textAlign:'center',color:'#fff',fontSize:13,padding:3}}>打赏获取 积分</Text>
					</TouchableOpacity>
          		</View>
          		<SubPicker 
          		 dataListType={this.state.dataListType} 
          		 dataList={this.state.dataList} 
          		 choiceOper={this.choiceOper.bind(this)}/>
          	</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		backgroundColor:'#fff',
		flex:1
	},
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
	footerBar:{
		flexDirection:'row',
		backgroundColor:'#F3F3F4',
		borderTopWidth:1,
		borderColor:'#D1D1D1',
		height:50,
		justifyContent:'flex-end'
	},
	footerBar_popBtn:{
		justifyContent:'center',
		alignItems:'center',
		flex:1
	},
	scoreBtn:{
		backgroundColor:'#CD2626',
		flex:2
	},
	payBtn:{
		backgroundColor:'#008B00'
	},
	item: {
        flexDirection: 'row',
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
