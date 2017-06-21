import React , {Component} from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	DeviceEventEmitter,
	Modal,
	AsyncStorage,
	Image
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
export default class DetailMenuPage extends Component{

	constructor(props){
		super(props);
		this.rentRoomDao = new RentRoomDao();
		this.recruitDao = new RecruitDao();
		this.state = {
			isShowModal:false,
			isShowPicker:true,
			houseConfig:[],
			choiceArea:'全广州市',
			choiceSort:'默认排序',
			choiceSalary:'薪资不限',
			choiceConfig:[],
			resultData:[]
		}
	}

	_pop(){
		this.props.navigator.pop();
	}

	_renderHeaderMenuItem(title,icon,type){
		let itemTitle = title+'';
		return(
			<TouchableOpacity onPress={this._pickShow.bind(this,type)} style={{flex:1,borderRightWidth:1,alignItems:'center',borderColor:'#D1D1D1'}}>
  				<Text style={{fontSize:14}}>{itemTitle.length>8 ? itemTitle.substring(0,6)+'..' :itemTitle } <Icon size={15} color='#D1D1D1' name={icon}/></Text>
  			</TouchableOpacity>
		)
	}


	_cancelPicker(){
		this.setState({isShowModal:false,isShowPicker:true});
		Picker.hide();
	}

	_pickShow(type){
		let dataList ;
		if(type === 'area'){
			dataList = ['全广州','荔湾区','越秀区','海珠区',
						'天河区','白云区','黄埔区','番禺区','花都区',
						'南沙区','从化区','增城区']
		}else if(type === 'sort'){
			dataList = ['默认排序','离我最近','薪金最高','最近发布']
		}else if(type === 'salary'){
			dataList = ['薪资不限','1000以下','1000-2000','2000-3000',
                '3000-5000','5000-8000','8000-12000','12000-20000'
                ,'20000-25000','25000以上']
		}else{
			this.setState({
				isShowPicker:false,
				isShowModal:true
			});
			return;	
		}
		Picker.init({
        pickerData:dataList,
        pickerConfirmBtnText:'确认筛选',
		pickerCancelBtnText:'取消筛选',
		pickerTitleText:'筛选条件',
		pickerFontSize:20,
        onPickerConfirm: data => {
        	let choiceData = {};

        	if(type === 'area'){
				this.setState({
					choiceArea:data
        		});
        	}else if(type === 'sort'){
        		this.setState({
					choiceSort:data
        		});
        	}else{
        		this.setState({
					choiceSalary:data
        		});
        	}
        	
        	this._cancelPicker();
        },
        onPickerCancel: data => {

        	this._cancelPicker();
        },
    });
	this.setState({isShowModal:true,isShowPicker:true});
    Picker.show();

	}


	componentDidMount(){
		this._loadHouseConfig();
		this._loadData();
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
        console.log(views)
        return views;

    }

	_chlickCheckBox(){
		
	}


	_loadData(){
		let recruitmentCondition={
            orderByNumber:0,
            industryId:0,
            regionName:'',
            binaryString:0,
            minMoney:5000,
            maxMoney:8000,
            pageNo:1,
            pageSize:10,
            longitude:'113.278132',
            latitude:'23.149282'
        }
        this.recruitDao.getDetailRecruitmentList(recruitmentCondition)
            .then(json =>{
            	console.log(json)
            	this.setState({
            		resultData:json
            	});
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


	render(){
		return (
			<View style={styles.container}>
				<NavigationBar title={this.props.title} leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}/>
          		<View style={styles.headerBar}>
          			{this._renderHeaderMenuItem(this.state.choiceArea,'caret-down','area')}
          			{this._renderHeaderMenuItem(this.state.choiceSort,'caret-down','sort')}
          			{this._renderHeaderMenuItem(this.state.choiceSalary,'caret-down','salary')}
          			{this._renderHeaderMenuItem('筛选','sliders','multi')}
          		</View>
          		<ScrollView style={{flex:1}}>
					<GetRecruitItemOrRentItem uid={this.props.userInfo.id} position={this.props.position} type='recruit' navigator={this.props.navigator} dataList={this.state.resultData}/>
          		</ScrollView>
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
})
