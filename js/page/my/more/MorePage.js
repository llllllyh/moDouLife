import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Modal
} from 'react-native';


import ScoreRecord from './sub_more_tab/ScoreRecord';
import MyCollectionAndBook from './sub_more_tab/MyCollectionAndBook';
import Button from 'react-native-button';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import NavigationBar from '../../../common/NavigationBar';
export default class MorePage extends Component{

	_pop(){
		this.props.navigator.pop();
	}

	render(){
		let content = <ScrollableTabView 
						tabBarInactiveTextColor='mintcream'
						tabBarActiveTextColor='#ee735c'
						tabBarBackgroundColor='#fff'
						tabBarInactiveTextColor='grey'
						tabBarUnderlineStyle={{backgroundColor:'#ee735c',height:2}}
						renderTabBar={() => <ScrollableTabBar/>}
					  >
						<MyCollectionAndBook loginUser={this.props.loginUser} type='collection' navigator={this.props.navigator} tabLabel='我的收藏'/>
					    <MyCollectionAndBook loginUser={this.props.loginUser} type='book' navigator={this.props.navigator} tabLabel='租房预约'/>
					   	<ScoreRecord navigator={this.props.navigator} tabLabel='积分纪录'/>
					</ScrollableTabView>
		return(
			<View style={styles.container}>
				<NavigationBar
					title='更多信息'
					style={styles.bar}
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
					rightButton = {<TouchableOpacity><Text style={{backgroundColor:'#fff',fontSize:14,paddingHorizontal:5,paddingVertical:5,color:'#ee735c',marginRight:10}}>当前:全部</Text></TouchableOpacity>}
				/>
			 	
				{content}
				
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
		fontSize:15,
		paddingLeft:5,
		paddingRight:5,
		fontWeight:'bold'
	},
})