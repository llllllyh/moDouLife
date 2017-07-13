import React , {Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Alert,
	TextInput,
	Modal
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import Util from '../../util/util';
import Button from 'react-native-button';
export default class GetScoreByPay extends Component{

	constructor(){
		super();
		this.state = {
			price:0,
			showGetScoreMsg:'打赏可获取对应积分'
		}
	}

	_pop(){
		this.props.navigator.pop();
	}

	_showInfo(){
		Alert.alert(
			'提示',
			'每打赏￥1，即可获得30积分！',
			[
				{
					text:'确定'
				}
			]
		)
	}

	handleInput(text){
		let reg = /^\+?[1-9]\d*$/;
		if(!text){
			this.setState({showGetScoreMsg:"打赏可获取对应积分"});
			return;
		}

        if (!reg.test(text.trim())) {
        	this.setState({showGetScoreMsg:"请输入正确的金额"});
            return;
        }
        this.setState({price:text.trim(),showGetScoreMsg:"你可以获得"+text*30+"积分"});
	}

	render(){
		return(
			<View style={{flex:1,backgroundColor:'#f3f3f4'}}>
				<NavigationBar title={this.props.title}
					style={styles.bar}
					leftButton={<TouchableOpacity onPress={()=>this._pop()}>
									<Text style={styles.bar_btn}>返回</Text>
								</TouchableOpacity>} 

					rightButton={<Button onPress={()=>this._showInfo()} style={{backgroundColor:'#fff',padding:5,marginRight:10,fontSize:15,color:'#ee735c'}}>打赏说明</Button>}
				/>
				<View>
					<Text style={{fontSize:16,textAlign:'center',padding:12,color:'grey'}}>
						感谢您对本软件的支持，我们会继续努力~！
					</Text>
					<Text style={{fontSize:16,textAlign:'center',color:'grey',paddingBottom:10}}>
						谢谢亲！
					</Text>
					<View style={{backgroundColor:'#fff'}}>
						<View style={{flexDirection:'row',borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}}>
							<Text style={{fontSize:16,padding:10}}>打赏金额¥</Text>
							<TextInput onChangeText={(text) => this.handleInput(text)}
							 style={{flex:1,fontSize:15}} placeholder='在这输入打赏金额～' clearButtonMode='while-editing'/>
						</View>
						<Text style={{height:35,paddingLeft:10,lineHeight:35,color:'red',fontSize:15}}>{this.state.showGetScoreMsg}</Text>
						<View style={{flexDirection:'row',borderTopWidth:Util.pixel,borderColor:'#D1D1D1'}}>
							<Text style={{fontSize:16,padding:10}}>反馈</Text>
							<TextInput placeholderTextColor='#D1D1D1' style={{height:100,fontSize:15,flex:1,paddingTop:10}} placeholder='有什么想告诉我们的么？'	multiline={true} clearButtonMode='while-editing'/>
						</View>
					</View>
				</View>
				<View style={{marginTop:50,padding:20}}>
					<Button style={{height:35,backgroundColor:'#ee735c',color:'#fff',lineHeight:30}}>点击继续</Button>
				</View>
				<Modal>
				
				</Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	bar_btn:{
		color:'#fff',
		fontSize:15,
		paddingLeft:5,
		paddingRight:5,
		fontWeight:'bold'
	},
});
