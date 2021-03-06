import React,{Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
} from 'react-native';

import RecruitDetail from '../page/detail/RecruitDetail';
import RoomDetail from '../page/detail/RoomDetail';
import Util from '../util/util';
import Tool from '../util/tool';
import Config from '../util/config';
export default class GetRecruitItemOrRentItem extends Component{

	constructor(props){
		super(props);
	}

	_toChooseDetailPage(id,count,money){
		let page = '';
		let pageType = 'home';
		if(this.props.type === 'rent'){
			page=RoomDetail
		}else{
			page=RecruitDetail
		}
		this.props.navigator.push({
			component:page,
			params:{
				id:id,
				uid:this.props.uid,
				positionCount:count,
				money:money,
				pageType:this.props.pageType
			}
		})
	}


	render(){
		if(!this.props.dataList){
			return <View/>
		}
		let position1 = this.props.position;
		return(
			<View>
				{						
					this.props.dataList.map((item,index) => {
						let position2 = {};
						position2.latitude = item.latitude;
						position2.longitude = item.longitude;
						let moneyType = this.props.moneyType === 'day' ? '元/日' : '元/月';
						let positionCount = position1.latitude ? Tool.getGreatCircleDistance(position1,position2) :'未知';
						let money = item.salaryDescription === undefined ? item.rent+moneyType : item.salaryDescription;
						let base = Config.api.base.substring(0,Config.api.base.indexOf('/weixin'));
						return (
							<View key={index}>
							<TouchableOpacity onPress={this._toChooseDetailPage.bind(this,item.id,positionCount,money)} style={{padding:10,flexDirection:'row'}}> 
								{
									this.props.type === 'rent'?
									<View>
										<Image style={{height:60,width:100,resizeMode:'stretch',marginRight:5}} source={{uri:base+'/houseImages/smallImages/'+item.smallImageFileName}} />
									</View>
									:null
								}
								<View style={{flex:1}}>
									<Text ellipsizeMode='tail' numberOfLines={1} style={{marginBottom:3,fontSize:15,width:Util.size.width*0.6}}>
										{
											item.title
										}
									</Text>
									<Text ellipsizeMode='tail' numberOfLines={1} style={{marginBottom:3,color:'grey'}}>
										{
											item.companyName === undefined ? item.address : item.companyName
										}
									</Text>
									<View style={{flexDirection:'row'}}>
										<View style={{flex:1}}>
											<Text ellipsizeMode='tail' numberOfLines={1} style={{color:'red',paddingRight:10}}>
												{
													money
												}
											</Text>
										</View>
										<View>
											<Text>
												{positionCount}
											</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>
							<View style={{borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}} />
						</View>
						)
					})	
				}
				
			</View>
		)
	}
}

const styles = StyleSheet.create({


})