import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	RefreshControl,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';

import Util from '../../../../util/util';
import Tool from '../../../../util/tool';
import UserDao from '../../../../expand/dao/userDao';
import Toast, {DURATION} from 'react-native-easy-toast';
export default class MorePage extends Component{
	constructor(props){
		super(props);
		this.userDao = new UserDao();
		this.state = {
			dataArray:[],
			isLoading:false,
			buttonRect: {},
			isVisible:false,
			isRefreshing:false,
			isSuccess:false
		}
	}

	_loadData(type){
		if(this.state.isRefreshing){
			this.refs.toast.show('正在努力加载中...');
			return ;
		}
		if(type === 'refreshing'){
			this.setState({isLoading:false,isRefreshing:true});
		}else{
			this.setState({isLoading:true,isRefreshing:false});
		}
	
		this.userDao.getScoreRecord(0)
			.then(res => {
				if(type !== 'first'){
					this.refs.toast.show('刷新成功！');
				}
			
				this.setState({
					dataArray:res,
					isLoading:false,
					isRefreshing:false,
					isSuccess:true
				})
			})
			.catch((error) => {
				if(type !== 'first'){
					this.refs.toast.show('刷新失败！');
				}
				console.log(error);
				this.setState({
					isLoading:false,
					isRefreshing:false,
					isSuccess:false
				});
			})
	}

	//此函数用于为给定的item生成一个不重复的key
	 _keyExtractor = (item, index) => item.key = index;

	 _renderItem ({item}){
	 	let date = Tool.forDate(new Date(item.scoreTime));
		return (
			<TouchableOpacity key={item.key} style={styles.item}>
				<Text style={styles.item_method}>{item.scoreCase<0 ? '使用积分':'获得积分'}</Text>
				<Text style={styles.item_desc}>{item.description}</Text>
				<View style={styles.item_bottom}>
					<Text style={styles.color_red}>{item.scoreCase>0 ? '+':''}{item.scoreCase}</Text>
					<Text>{date}</Text>
				</View>
			</TouchableOpacity> 
		)
	}

	_pop(){
		this.props.navigator.pop();
	}

	componentDidMount(){
		this._loadData('first');
	}



	

	render(){
		return(
			<View style={{flex:1}}>
				{	
					
					this.state.isLoading ?
					<View style={styles.fail}>
						<ActivityIndicator
					          color="#ee735c"
					          size="large"
					        />
					</View>					
					:
					!this.state.isSuccess ?
					<TouchableOpacity onPress={this._loadData.bind(this,'loading')} style={styles.fail}>
						<Text style={{fontSize:16}}>网络连接失败，点击刷新！</Text>
					</TouchableOpacity>
					:
					this.state.dataArray.length<=0 ?
					<View  style={styles.fail}>
						<Text style={{fontSize:16}}>暂无积分记录</Text>
					</View>
					:
					<FlatList 
					data={this.state.dataArray}
					renderItem={this._renderItem}
					keyExtractor={this._keyExtractor}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this._loadData.bind(this,'refreshing')}
							colors={['#ee735c']}
							tintColor={'#ee735c'}
							title={'正在加载中...'}
							titleColor={'#ee735c'}
						/>
					}
				/>
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
	item:{
		flex:1,
		padding:10,
		paddingLeft:10,
		borderBottomWidth:Util.pixel,
		borderColor:'#D1D1D1'
	},
	item_method:{
		fontSize:16,
		paddingBottom:3
	},
	item_desc:{
		color:'grey',
		paddingBottom:3
	},
	item_bottom:{
		flexDirection:'row',
		justifyContent:'space-between'
	},
	color_red:{
		color:'red'
	},
	fail:{
		paddingTop:Util.size.height*0.35,
		flex:1,
		alignItems:'center'
	}

})