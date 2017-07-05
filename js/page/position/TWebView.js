import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity
} from 'react-native';

//startInLoadingState强制WebView在第一次加载时先显示loading视图。默认为true。
//onError加载失败时调用。
class TWebView extends Component{

	constructor(props){
		super(props);
		this.state = {
			url:this.props.url,
			isError:false,
			mId:1
		}
	}

	choiceMethod(id){
		if(this.state.mId == id){
			return;
		}
		this.setState({
			mId:id
		});
	}


	render(){
		let URL = this.state.url+'?currPosition='+this.props.position+'&method='+this.state.mId;
		return(
			<View style={styles.container}>
				{
					this.state.isError?
					<View style={styles.errorInfo}>
						<Text style={styles.text}>
							网络错误，请重试！
						</Text>
					</View>
					:
					<View style={styles.container}>
					<View style={styles.bar}>
						<TouchableOpacity style={styles.container} onPress={()=>this.props.pop()}>
							<Text style={[styles.bar_text,styles.marginTop15]}>返回</Text>
						</TouchableOpacity>
						<View style={styles.method}>
							<TouchableOpacity onPress={()=>this.choiceMethod(1)}>
								<Text style={styles.bar_text}>驾车</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>this.choiceMethod(2)}>
								<Text style={styles.bar_text}>公交</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>this.choiceMethod(3)}>
								<Text style={styles.bar_text}>步行</Text>
							</TouchableOpacity>
						</View>
					</View>
					<WebView bounces={false} source={{uri:URL}} 
						onError={this._showError.bind(this)}
						startInLoadingState={true}
						style={{marginTop:-20}}
					/>
					</View>
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
	},
	bar:{
		height:64,
		backgroundColor:'#ee735c',
		zIndex:99,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	},
	bar_text:{
		color:'#fff',
		padding:10,
		fontSize:15,
		fontWeight:'600'
	},
	marginTop15:{
		marginTop:15,
	},
	method:{
		flexDirection:'row',
		flex:2,
		marginTop:15
	}

})

module.exports=TWebView;