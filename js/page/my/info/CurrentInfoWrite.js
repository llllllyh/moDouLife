import React,{Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Image,
	Modal,
	DatePickerIOS
} from 'react-native';


import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import NavigationBar from '../../../common/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Util from '../../../util/util';
import ArrayTool from '../../../util/arrayTool';
import Tool from '../../../util/tool';
import Config from '../../../util/config';
import Toast, {DURATION} from 'react-native-easy-toast';
import UserDao from '../../../expand/dao/userDao';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import ImagePicker from 'react-native-image-picker'; 
import CityPage from '../../position/CityPage';


var options = {
  title: '选择头像',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'选择相册',
  quality:0.75,
  allowsEditing:true,
  noData:false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


export default class CurrentInfoWrite extends Component{

	constructor(props){
		super(props);
		this.userDao = new UserDao();
		 let time = new Date().getTime();
		this.state = {
			isShowSet:false,
			currentType:'',
			showTitle:'',
			oldVal:'',
			text:'',
			isTextArea:false,
			chooseDate:'',
			img:this.props.img+time,
		}
	}


	

	choiceOper(type,date){
		console.log(date)
	}

	_toChangeInfo(type,text){
		this.setState({text:''},function(){
			let showTitle ='';
			switch(type){
				case 'sign':
					showTitle='个性签名';
					break;
				case 'sex':
					showTitle='选择性别';
					break;
				case 'birthday':
					showTitle='出生日期';
					break;
				case 'area':
					showTitle='地区选择';
					break;
				case 'address':
					showTitle='地址填写';
					break;
				case 'name':
					showTitle='填写昵称';
					break;
				default:

			}
			let self = this;
			if(type==='area'){

				this.props.navigator.push({
					component:CityPage,
					
					params:{
						pageType:'address',
						callback:function(area) {
                       		self.userDao.updateUser(self.props.loginUser.username,area,'area')
                       			.then(res => {
                       				let user={};
                       				user.area = area;
                       				RCTDeviceEventEmitter.emit('changeUser',user);
                       				self.refs.pageToast.show('修改成功！');
                       			})
                       			.catch((error)=>{
                       				self.refs.pageToast.show('修改失败！');
                       			})
                       	}
					}
				})
				return;
			}
			if(type === 'avatar'){
				this._pickPhoto();
				return;
			}
			if(type === 'birthday'){
				this.setState({
					chooseDate:this.props.loginUser.birthday
				});
			}
			if(showTitle){
				this.setState({showTitle:showTitle,oldVal:text,isShowSet:true,currentType:type});
			}
			

		}.bind(this));
		
	}
	
	_pickPhoto(){
	    let self=this;
	    ImagePicker.showImagePicker(options, (response) => {
	      	if (response.didCancel) {
	        	return;
	      	}
	      	this.uploadImage(response.uri);
	  	})
	}

	uploadImage(imageuri){
        let formData = new FormData();
        let file = {uri: imageuri,type:'multipart/form-data',name:'image.png'};
        formData.append('inputName',file);
        let URL =Config.api.base+Config.api.uploadPicURL+'/'+this.props.loginUser.username;
        fetch(URL,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
            .then((response)=>{
            	if(response.ok){
            		let user={};
		            user.avatar='avatar';
		            RCTDeviceEventEmitter.emit('changeUser',user);
		            let time = new Date().getTime();
		            this.setState({
		            	img:this.props.img+time
		            })
            		this.refs.pageToast.show('头像更改成功！');
            	}
            })
            .catch((error)=>{
            	this.refs.pageToast.show('头像更改失败！');
            });

    }


	_closeModal(){
		 this.setState({isShowSet:false});
	}

	_saveUpdate(){
		let type = this.state.currentType;
		if(this.state.text==='' && this.state.oldVal === ''){
			this.refs.modalToast.show('输入不能为空！');
			return;
		}

		this.userDao.updateUser(this.props.loginUser.username,this.state.text,type)
		.then(res => {
			let user={};
			if(type === 'name'){
				user.nickName = this.state.text;
			}else if(type === 'sign'){
				user.qianMing = this.state.text;
			}else if(type === 'address'){
				user.address = this.state.text;
			}else if(type === 'sex'){
				user.sex = this.state.text;
			}else if(type === 'birthday'){
				user.birthday=this.state.text;
			}
			RCTDeviceEventEmitter.emit('changeUser',user);
		})
		.then(function(){
			this._closeModal();
			this.refs.pageToast.show('修改成功！');
		}.bind(this))
		.catch((error) =>{
			this.refs.modalToast.show('修改失败！');
		})
		
		
	}
	_pop(){
		this.props.navigator.pop();
	}

	 onSelect(index, value){
         this.setState({text:value});
     }

	_renderItemInput(title,type,text){

		return (
			<TouchableOpacity onPress={this._toChangeInfo.bind(this,type,text)} style={{borderBottomWidth:Util.pixel,borderColor:'#D1D1D1',padding:15,flexDirection:'row',alignItems:'center',backgroundColor: 'white',}}>
				<Text style={{fontSize:15}}>{title}</Text>
				
					{
						<View  style={{flex:1}}>
							<View style={{alignItems:'flex-end'}}>
							<Text>
								{
									type === 'avatar' ?
									<Image style={styles.avatar} source={{uri:this.state.img}}/>
									:
									type === 'birthday' ?
									Tool.getLocalTime(text)
									:
									text? text.length < 12 ? text : text.substring(0,12)+'...' : null
								}
							</Text>
							</View>
						</View>
					}
					
			</TouchableOpacity>
		)
	}

	_renderModal(){
		if(!this.props.loginUser){
			return;
		}
		return(
			<Modal
		          animationType={'slide'}
		          transparent={false}
		          visible={this.state.isShowSet}
		          onRequestClose={() => {alert("Modal has been closed.")}}
		          >
		         <View style={{backgroundColor:'#f3f3f4',flex:1}}>
		          	<NavigationBar 
						title={this.state.showTitle}
						style={styles.bar}
						leftButton={<TouchableOpacity onPress={this._closeModal.bind(this)}><Text style={{color:'#fff',marginLeft:10}}>返回</Text></TouchableOpacity>}
		          		rightButton={<TouchableOpacity onPress={this._saveUpdate.bind(this)}><Text style={styles.btn_save}>保存</Text></TouchableOpacity>}
		          	/>
		          	<View style={{height:40}}>
		          	{
		          		this.state.currentType === 'birthday' ?
						<View>
			          		<DatePickerIOS
			          		  minimumDate={new Date('1950-01-01')}
			          		  maximumDate={new Date()}
					          mode="date"
					          date={new Date(this.state.oldVal).getTime()}
					       	  onDateChange={(date)=>{
					       	  	this.setState({
					       	  		oldVal:date,
					       	  		text:date
					       	  	});
					       	  }}
					        />
				        </View>
				        :
		          		this.state.currentType === 'sex' ?
		          		  	<RadioGroup style={{backgroundColor:'#fff'}} selectedIndex={this.props.loginUser.sex} onSelect = {(index, value) => this.onSelect(index, value)}>		       
			                    <RadioButton style={{borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}} value={0} >
			                    	<View style={{flexDirection:'row'}}>
				                        <Text style={{fontSize:20}}>男</Text>
				                        <Image style={{width:23,height:20}} source={require('../../../../res/images/male.png')}/>
			                        </View>
			                    </RadioButton>
			                   <RadioButton  color='#FE214C' style={{borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}} value={1} >
			                    	<View style={{flexDirection:'row'}}>
				                        <Text style={{fontSize:20}}>女</Text>
				                        <Image style={{width:23,height:20}} source={require('../../../../res/images/female.png')}/>
			                        </View>
			                    </RadioButton>
	                    	</RadioGroup>
		          		:
		          		this.state.currentType !== 'sign'?
			          	<View style={{padding:5,height:40,borderBottomWidth:Util.pixel,backgroundColor:'#fff',borderColor:'#D1D1D1'}}>
							<TextInput placeholder='请输入修改后的值' 
								defaultValue={this.state.oldVal} style={{flex:1}}
								autoCapitalize={'none'}
								autoCorrect={false}
								maxLength={20}
						   		clearButtonMode='while-editing'
								onChangeText = {(text) => {
									this.setState({
										text
									});
								}}/>
						</View>
						:
						<View style={{backgroundColor:'#fff',height:Util.size.height}}>
							<TextInput multiline={true} placeholder='用一段话介绍自己吧（建议140字以内）'
								clearButtonMode='while-editing' maxLength={140} defaultValue={this.state.oldVal} 
								style={{fontSize:17,flex:1}}
								onChangeText = {(text) => {
									this.setState({
										text
									});
								}}/>
						</View>
					}
					</View>
				</View>
				
				<Toast 
                    ref="modalToast"
                    style={styles.sty_toast}
                   	position='center'
                />
	        </Modal>
		)
	}

	render(){
		let loginUser = this.props.loginUser;
		return (
			<View style={styles.container}>
				<NavigationBar 
					style={styles.bar}
					title='个人信息'
					leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
				/>
				<View style={{padding:10,borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}}>
					<Text style={{color:'#ee735c'}}>基本信息</Text>
				</View>
				<View>	
					{this._renderItemInput('更换头像','avatar','')}
					{this._renderItemInput('更换昵称','name',loginUser.nickName)}
					{this._renderItemInput('个性签名','sign',loginUser.qianMing)}
				</View>
				<View style={{padding:10,borderBottomWidth:Util.pixel,borderColor:'#D1D1D1'}}>
					<Text style={{color:'#ee735c'}}>个人资料</Text>
				</View>
				<View>	
					{this._renderItemInput('性别','sex',loginUser.sex === 1 ? '女':'男')}
					{this._renderItemInput('出生日期','birthday',loginUser.birthday)}
					{this._renderItemInput('所在地区','area',loginUser.district)}
					{this._renderItemInput('我的地址','address',loginUser.address)}
				</View>
				{this._renderModal()}
				<Toast 
                    ref="pageToast"
                    style={styles.sty_toast}
                   	position='center'
                />
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor: '#f3f3f4',

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
	btn_save:{
		color:'#fff',
		padding:10,
		paddingTop:5,
		paddingBottom:5,
		backgroundColor:'#fff',
		color:'#ee735c',
		marginRight:10,
	},
	avatar:{
		width:50,
		height:50,
		borderRadius:25,
		borderWidth:Util.pixel,
		borderColor:'#D1D1D1'
	}
})
