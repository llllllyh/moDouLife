//自带组件
import React,{Component} from 'react';
import {
	View,
	StyleSheet,
	Text,
	AsyncStorage
}from 'react-native';



//自己写的组件
import WelcomePage from './start-up/WelcomePage';

import FirstStartUp from './start-up/FirstStartUp';

//第三方组件
//0.44版本以上移植到react-native-deprecated-custom-components
import {Navigator} from 'react-native-deprecated-custom-components';

function Setup(){
	//进行一些初始化配置
	class Root extends Component{
		constructor(props){
			super(props);
			this.state = {
				isFirst:''
			}
		}

		componentDidMount(){
			this._asyncShowComponent();
		
		}

		//AsyncStorage.removeItem('userInfo');
		//AsyncStorage.removeItem('isFirst');

		_asyncShowComponent(){
			AsyncStorage.getItem('isFirst')
				.then((value) => {
					let isFirst =value;
					if(!isFirst){
						isFirst='true';
					}else{
						isFirst='false';
					}
					this.setState({isFirst})
				})
		}

		renderScene(route,navigator){
			let Component = route.component;
			return <Component {...route.params} navigator={navigator} />
		}

		render(){
			if(this.state.isFirst===''){
				return <View/>
			}
			let showComponent = this.state.isFirst === 'false' ? WelcomePage : FirstStartUp;
			return (
				<Navigator 
					initialRoute={{component:showComponent}}
					renderScene={(route,navigator) => this.renderScene(route,navigator)}
				/>
			)
		}
	}
	return <Root/>
}

export default Setup
