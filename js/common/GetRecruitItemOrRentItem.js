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

	_toChooseDetailPage(id,count){
		let page = '';
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
				positionCount:count
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
						let positionCount = position1.latitude ? Tool.getGreatCircleDistance(position1,position2) :'未知';
						
						return (
							<View key={index}>
							<TouchableOpacity onPress={this._toChooseDetailPage.bind(this,item.id,positionCount)} style={{padding:10,flexDirection:'row'}}> 
								{
									this.props.type === 'rent'?
									<View>
										<Image style={{height:60,width:100,resizeMode:'stretch',marginRight:5}} source={require('../../res/images/timg.jpeg')} />
									</View>
									:null
								}
								<View style={{flex:1}}>
									<Text style={{marginBottom:3,fontSize:15}}>
										{
											item.title.length<=10 ? item.title : item.title.substring(0,10)+'...'
										}
									</Text>
									<Text style={{marginBottom:3,color:'grey'}}>
										{
											item.companyName === undefined ? item.address.length>10 ? item.address.substring(0,10)+'...' : item.address : item.companyName
										}
									</Text>
									<View style={{flexDirection:'row',justifyContent:'space-between'}}>
										<View>
											<Text  style={{color:'red'}}>
												{
													item.salaryDescription === undefined ? item.rent+'元/月' : item.salaryDescription
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