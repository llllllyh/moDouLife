import React , {Component} from 'react';
import {
	View,
	StyleSheet
} from 'react-native';
import {CountDownText} from 'react-native-sk-countdown'
export default class VerifyCode extends Component{

	//生命周期防止输入带来的重新渲染
	shouldComponentUpdate(){
		return false
	}


	_countingDone(){
		this.props.countingDone();
	}
	

	render(){
		return(
			<View>
				<CountDownText 
				 	style={[styles.countBtn]}
				    countType='seconds' // 计时类型：seconds / date
		            auto={true} // 自动开始
		            afterEnd={()=>this._countingDone()} // 结束回调
		            timeLeft={60} // 正向计时 时间起点为0秒
		            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
		            startText='获取验证码' // 开始的文本
		            endText='重新获取' // 结束的文本
		            intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	countBtn:{
		height:50,
		width:122,
		lineHeight:50,
		backgroundColor:'#ee735c',
		color:'#fff',
		borderColor:'#ee735c',
		textAlign:'center',
		fontWeight:'600',
		fontSize:17,
	},
})
