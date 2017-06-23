import React , {Component} from 'react';
import{
	Text,
	View,
	TouchableOpacity,
	ScrollView
} from 'react-native';

import DetailRentMenuPage from '../page/filter/detailMenu/DetailRentMenuPage';
import DetailRecruitMenuPage from '../page/filter/detailMenu/DetailRecruitMenuPage';
import Util from '../util/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
class FilterMenuItem extends Component {


	closeAndOpenMenu(index){
		console.log('subIndex='+index);
		this.props.openSubMenu(true);
		RCTDeviceEventEmitter.emit('choiceIndex',index)
	}

	_toListPage(name,id){
		let page = DetailRecruitMenuPage;
		if(name === '长租房' || name === '月租房' || name === '日租房'){
			page = DetailRentMenuPage;
		}
		this.props.navigator.push({
			component:page,
			params:{
				position:this.props.position,
				userInfo:this.props.userInfo,
				title:name,
				typeId:id,
				dataType:this.props.dataType
			}
		})
	}

	render(){

		return(
			<ScrollView style={{flex:1,backgroundColor:'#f3f3f4'}} bounces={false}>
				{
					this.props.dataList.map((item,index) => {
						let method =  this.props.pageType !== 'sub' ? (item.id !== 0 ? this.closeAndOpenMenu.bind(this,item.id) 
							:this._toListPage.bind(this,item.name,item.id)) : this._toListPage.bind(this,item.name,item.id);
						
						return (
							<TouchableOpacity onPress={method} key={index} style={{padding:10,backgroundColor:'#fff',
							borderColor:'#D1D1D1',borderBottomWidth:Util.pixel,flexDirection:'row',justifyContent:'space-between'}}>
								<Text style={{fontSize:16}}>{item.name}</Text>
								<Icon name='angle-right' size={16} style={{lineHeight:20}}/>
							</TouchableOpacity>
						)
					})
				}

			</ScrollView>
		)
	}
}



export default FilterMenuItem ;