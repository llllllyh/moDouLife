import React , {Component} from 'react';
import{
	Text,
	View,
	TouchableOpacity,
	ScrollView
} from 'react-native';

import DetailMenuPage from '../page/filter/detailMenu/DetailMenuPage';
import Util from '../util/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
class FilterMenuItem extends Component {


	closeAndOpenMenu(index){
		this.props.openSubMenu(true);
		RCTDeviceEventEmitter.emit('choiceIndex',index)
	}

	_toListPage(){
		this.props.navigator.push({
			component:DetailMenuPage,
			params:{
				position:this.props.position,
				userInfo:this.props.userInfo
			}
		})
	}

	render(){

		return(
			<ScrollView style={{flex:1,backgroundColor:'#f3f3f4'}} bounces={false}>
				{
					this.props.dataList.map((item,index) => {
						let method =  this.props.pageType !== 'sub' ?  this.closeAndOpenMenu.bind(this,index) : 
								this._toListPage.bind(this);
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