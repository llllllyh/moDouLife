import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter
} from 'react-native';


//自定义组件
import HomeIndex from './home/HomeIndex';
import LoginPage from './login/LoginPage';
import MyPage from './my/MyPage';
//第三方组件
import Icon from 'react-native-vector-icons/FontAwesome';
import TabNavigator from 'react-native-tab-navigator';
export default class HomePage extends Component{
	constructor(props) {
        super(props);
    	this.state = {
    		selectedTab: 'tb_home',
    	}
    }

    componentDidMount(){
		this.listener = DeviceEventEmitter.addListener('toTabPage',function(tab){
			this.setState({
				selectedTab:tab
			});
		}.bind(this));
	}


	componentWillUnmount(){
		this.listener.remove();
	}


    _renderTab(title,selectedTab,iconName,Component) {
    	return (
    		<TabNavigator.Item
    			selected={this.state.selectedTab === selectedTab}
    			title={title}
    			titleStyle={styles.tab_title}
    			selectedTitleStyle={styles.selectedTabText}
    			renderIcon={()=>  <Icon  name={iconName} style={{color:'grey'}} size={25} />}
    			renderSelectedIcon={()=> <Icon name={iconName} size={25} style={{color:'red'}}/>}
    			onPress={() => this.setState({selectedTab: selectedTab})}>
                <Component {...this.props}/>
    		</TabNavigator.Item>
    	)
    }


	render(){
		return (
			<View style={styles.container}>
				<TabNavigator>
					{this._renderTab('主页','tb_home','home',HomeIndex)}
					{this._renderTab('聊天','tb_chat','comments-o',HomeIndex)}
					{this._renderTab('通讯录','tb_MailList','address-book-o',HomeIndex)}
					{this._renderTab('动态','tb_track','tablet',HomeIndex)}
					{this._renderTab('个人中心','tb_my','user-circle-o',MyPage)}
				</TabNavigator>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#fff'
	},
	tab_title:{
		fontWeight:'bold',
		fontSize:12,
	},
	selectedTabText:{
		color:'red'
	}
});