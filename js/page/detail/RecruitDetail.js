import React,{Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
	ActivityIndicator,

} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import MapPage from './MapPage';

import RecruitDao from '../../expand/dao/recruitDao';

import Button from 'react-native-button';
import Util from '../../util/util';
import Tool from '../../util/tool';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast';
export default class RecruitDetail extends Component{

	constructor(props){
		super(props);
		this.recruitDao = new RecruitDao();
		this.state = {
			recruitMsg:{},
			industry:'',
			welfare:{},
			isLoading:false,
			isSuccess:false,
			isClikc:false,
			isCollection:false
		}
	}

	_getAllWelfare(){
		this.recruitDao.getAllWelfare()
			.then(response =>response.json()).then(json => {
				let welfare = Tool.changeBinary(json,this.state.recruitMsg.binarynum);
				this.setState({
					welfare
				});
			});

	}

	_pop(){
		this.props.navigator.pop();
	}

	_toMapPage(){
		this.props.navigator.push({
			component:MapPage
		})
	}
	_getRecruitData(flag){
		console.log('this.props.pageType='+this.props.pageType)
		if(flag){
			this.setState({isClikc:true});
		}else{
			this.setState({isLoading:true,isSuccess:false});
		}
		let self = this;
		this.recruitDao.getRecruitDetail(this.props.id,this.props.pageType)	
			.then((res) => {
				if(res){
					console.log(res)
					self.setState({
						recruitMsg:res,
						industry: this.props.pageType !== 'part' ? res.industry.name : null,
					},()=>{
						self._findThisIsCollection();
						if(this.props.pageType !== 'part'){
							self._getAllWelfare();
						}
						
						setTimeout(()=>{
							self.setState({
								isLoading:false,
								isSuccess:true,
								isClikc:false
							});
						},200)
					});

				}else{
					self.refs.toast.show('数据获取失败，请稍后再试！');
					self.setState({isLoading:false,isSuccess:false,isClikc:false});
					return;
				}
			})
			.catch((error) => {
				console.log(error)
				self.refs.toast.show('请检查你的网络连接是否正确！');
				self.setState({isLoading:false,isSuccess:false,isClikc:false});
				return;
	
			})
	}


	_findThisIsCollection(){
		let type = 'P';
		if(this.props.pageType === 'all'){
			type = 'A';
		}
		this.recruitDao.findRecruitIsCollection(this.state.recruitMsg.id,this.props.uid,type)
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
            let collectionCondition={
                "serialNumber" : (this.props.pageType !== 'part' ? 'A' : 'P') +this.state.recruitMsg.id,
                "type" : this.props.pageType !== 'part' ? 'r1' : 'r2',
                "img" : null,
                "title" : this.state.recruitMsg.title,
                "address" : this.state.recruitMsg.address,
                "moneyDesc" : this.state.recruitMsg.salaryDescription,
                "longitude" : this.state.recruitMsg.longitude,
                "latitude" :this.state.recruitMsg.latitude,
                "userId" : this.props.uid,
                "createTime" : null
            };
            try{
            	this.recruitDao.saveRecruitCollection(collectionCondition);
            	this.setState({
            		isCollection:true
            	});
            	this.refs.toast.show('收藏成功！');
            	return;
            }catch(error){
            	this.refs.toast.show('收藏失败，请稍后再试！');
            	return;
            }
        }else{
        	let type = 'P';
			if(this.props.pageType === 'all'){
				type = 'A';
			}
        	try{
        		this.recruitDao.cancelRecruitCollection(this.state.recruitMsg.id,this.props.uid,type)
        		this.setState({
            		isCollection:false
            	});
            	this.refs.toast.show('取消成功！');
            	return;
        	}catch(error){
        		this.refs.toast.show('取消失败，请稍后再试！');
            	return;
        	}
        }
	}

	

	componentDidMount(){
		this._getRecruitData(false);
		
	}

	_renderWelfare(arr,title){
		if(arr == null){
			return <View/>
		}
		let arrShow = arr.length <= 0 ?
			<View/>
			:
			<View style={{flexDirection:'row'}}>
				<Text style={{fontSize:16,marginBottom:7}}>{title}：</Text>
				{
					arr.map((item,index) => 
						<Text key={index} style={styles.welfareText}>{item}</Text>
					)
				}
			</View>;
		
		return arrShow;
	}
	

	render(){
		let recruitMsg = this.state.recruitMsg;
		if(!recruitMsg){
			return <View/>
		}
		let date = Tool.getLocalTime(recruitMsg.createTime);
		return(
			<View style={styles.container}>
				<NavigationBar 
					title='招聘详情'
					style={[styles.bar,{marginBottom:this.state.isLoading ? Util.size.height*0.35 :0}]}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
					rightButton={<TouchableOpacity onPress={this._addAndCancelCollection.bind(this)}>{!this.state.isSuccess ? null : this.state.isCollection ?  <Icon name='star' size={22} style={{color:'yellow',paddingRight:5}} /> : <Icon name='star-o' size={20} style={{color:'#fff',paddingRight:5}} />}</TouchableOpacity>}
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
						<TouchableOpacity onPress={this._getRecruitData.bind(this,true)} style={{flex:1,height:Util.size.height*0.8,paddingTop:Util.size.height*0.4,alignItems:'center'}}>
							<Text style={{fontSize:16}}>数据加载失败，点击刷新！</Text>
						</TouchableOpacity>
						:
						<View>
							<View style={styles.top_part}>
								<Text style={styles.top_part_text_1}>
									{recruitMsg.title}
								</Text>
								<Text style={styles.top_part_text_2}>
									{recruitMsg.companyName}
								</Text>
								<Text style={styles.top_part_text_2}>
									备注：{recruitMsg.note==null||recruitMsg.note=='' ? '没留下备注' : recruitMsg.note}
								</Text>
								<Text style={styles.top_part_text_3}>
									{recruitMsg.salaryDescription}
								</Text>
								<View style={{flexDirection:'row'}}> 
									<Text style={styles.top_part_bottom_text}>发布:{date}</Text>
									<Text style={styles.top_part_bottom_text}>&nbsp;距离:{this.props.positionCount}</Text>
									<Text style={styles.top_part_bottom_text}>&nbsp;浏览:{recruitMsg.viewed}人</Text>
								</View>
							</View>
							<View style={styles.top_part_bottom}>
								<Text style={{fontSize:16,marginBottom:7}}>职位：{this.props.pageType === 'all' ? 
								  this.state.industry :recruitMsg.plurality.name}</Text>
								  {
								  	this.props.pageType === 'part' ?
								  	<Text style={{fontSize:16,marginBottom:7}}>薪资：每{recruitMsg.settlement.setName}结算</Text>
								  	:null
								  }
								{this._renderWelfare(this.state.welfare.welfareR,'要求')}
								{this._renderWelfare(this.state.welfare.welfareF,'福利')}
								<TouchableOpacity onPress={this._toMapPage.bind(this)} style={{borderBottomWidth:Util.pixel,borderTopWidth:Util.pixel,paddingTop:20,paddingBottom:20,borderColor:'#D1D1D1',marginTop:10,flexDirection:'row',alignItems:'center'}} >
									<Text style={{fontSize:16,flex:5}}>
										{recruitMsg.region}
									</Text>
									<View style={{flex:1,alignItems:'center'}}>
										<Icon name='map-marker' size={22} style={{color:'#ee735c'}}/>
									</View>
								</TouchableOpacity>
							</View>
							<View style={{backgroundColor:'#fff',marginTop:10,padding:15}}>
								<View style={{flexDirection:'row',alignItems:'center'}}>
									<Icon name='comments' size={22} style={{color:'#ee735c'}}/>
									<Text style={{fontSize:16,color:'grey',paddingLeft:10}}>职位描述</Text>
								</View>
								<View style={{marginTop:15}}>
									<Text style={{fontSize:16}}>
										{recruitMsg.description}
									</Text>
								</View>
							</View>
						</View>
					}
				</ScrollView>
				{	
					!this.state.isSuccess?
					<View/>
					:
					<View style={styles.bottom_bar}>
						<Button style={styles.bottom_bar_btn}>电话：{recruitMsg.phone}</Button>
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
		backgroundColor:'#f3f3f4',
		flex:1
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
	bottom_bar:{
		justifyContent:'center',
		backgroundColor:'#CD2626',
	},
	bottom_bar_btn:{
		fontSize:16,
		padding:10,
		color:'#fff'
	},
	top_part:{
		backgroundColor:'#fff',
		padding:15
	},
	top_part_text_1:{
		fontSize:18,
		marginBottom:7
	},
	top_part_text_2:{
		fontSize:16,
		marginBottom:7,
		color:'#8B8B7A'
	},
	top_part_text_3:{
		fontSize:20,
		color:'red',
		marginBottom:10
	},
	top_part_bottom:{
		backgroundColor:'#fff',
		marginTop:10,
		padding:15
	},
	top_part_bottom_text:{
		fontSize:13,
		color:'grey'
	},
	welfareText:{
		height:16,
		padding:2,
		lineHeight:12,
		color:'#ff6815',
		fontSize:12,
		borderColor:'#ff6815',
		borderWidth:Util.pixel,
		marginLeft:2
	}
})
