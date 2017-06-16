import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

//startInLoadingState强制WebView在第一次加载时先显示loading视图。默认为true。
//onError加载失败时调用。
class TWebView extends Component{

	constructor(props){
		super(props);
		this.state = {
			url:this.props.url,
			isError:false,
		}
	}

	render(){
		return(
			<View style={styles.container}>
				{
					this.state.isError?
					<View style={styles.errorInfo}>
						<Text style={styles.text}>
							网络不好，请稍后再访问！
						</Text>
					</View>
					
					:
					<WebView source={{uri:this.state.url}} 
					onError={this._showError.bind(this)}
					startInLoadingState={true}
					style={{marginTop:-20}}/>
				}
			</View>
			
		);
	}

	_showError(){
		this.setState({
			isError:true
		});
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1 
	},
	errorInfo:{
		flex:1,
		//垂直居中
		justifyContent:'center',
		//水平居中
		alignItems:'center',
	},
	text:{
		fontSize:16,
		fontWeight:'300'
	}
})

module.exports=TWebView;