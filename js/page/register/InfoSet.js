import React , {Component} from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput,
	DatePickerIOS,
	Modal
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import Button from 'react-native-button';
import Util from '../../util/util';
import Tool from '../../util/tool';
import Config from '../../util/config';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import Toast, {DURATION} from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker'; 
import UserDao from '../../expand/dao/userDao';
import IndexPage from '../IndexPage';
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

export default class InfoSet extends Component{
	constructor(){
		super();
		this.userDao = new UserDao();
		this.state = {
			isUpLoadImg:false,
			upLoadImg:'',
			birthday:'XXXX年-XX月-XX日',
			password:'',
			sex:0,
			name:'',
			isShowModal:false,
			choiceBirthday:'1990-01-01',
			isDate:false
		}
	}

	_pop(){
		this.props.navigator.pop();
	}

	onSelect(index, value){
        this.setState({sex:value});
    }

    choiceDate(){
    	this.setState({
    		isShowModal:true,
    		isDate:true
    	});
    }

    confirmDate(){
    	this.setState({
    		isShowModal:false,
    		birthday:this.state.choiceBirthday
    	});
    }

    cancelDate(){
    	this.setState({
    		isShowModal:false
    	});
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
        let URL =Config.api.base+Config.api.uploadPicURL+'/'+this.props.username;
        console.log(URL)
        fetch(URL,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
        .then((res) => res.text())
        .then((response)=>{
        	this.setState({
        		isUpLoadImg:true,
        		uploadImage:response
        	});
        	this.refs.toast.show('头像上传成功！');
        })
        .catch((error)=>{
        	console.log(error)
        	this.refs.toast.show('头像上传失败！');
        });

    }


    _confirmRegister(){
    	this.setState({isShowModal:true,isDate:false});
		let reg = /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z ]{0,19}$/;
    	if(this.state.name === '' || !reg.test(this.state.name)){
    		this.refs.toast.show("昵称由1-20个字符，可由中英文、空格组成！");
            return ;
    	}
    	reg = /^[0-9A-Za-z!@#$^%*?,.]{6,20}$/;
    	if(this.state.password === '' || !reg.test(this.state.password)){
            this.refs.toast.show("密码由6-20个半角字符组成！");
            return ;
        }
    	reg = /^[0-9A-Za-z!@#$^%*?,.]{6,20}$/;
    	if(this.state.birthday == 'XXXX年-XX月-XX日'){
            this.refs.toast.show("请选择你的出生日期！");
            return ;
        }
        if(!this.state.isUpLoadImg){
        	this.refs.toast.show("请上传你的头像！");
            return ;
        }
        let info = this.props.checkedInInfo;
        let user = {
            id : parseInt(info.id),
	        username :this.props.username ,
	        nickName : this.state.name,
	        birthday : new Date(this.state.birthday),
	        myImg :this.state.uploadImage,
	        markPwd : this.state.password,
	        sex : this.state.sex,
	        validateTime :new Date(parseInt(info.validateTime)),
	        validateCode : info.validateCode
        };
        console.log(user)
        this.userDao.userRegisterOper(user)
        	.then(res => {
        		if(res.ok){
        			this.refs.toast.show('注册成功');
        			setTimeout(()=>{
        				this.props.navigator.replace({
        					component:IndexPage
        				});
        			},1000)
        		}
        	})
        	.catch((error) => {
        		this.refs.toast.show('注册失败');
    			this.setState({isShowModal:false});
        		console.log(error)
        	});

    }


	render(){
		let time = new Date().getTime();
		let base = Config.api.base.substring(0,Config.api.base.indexOf('/weixin'));
		let img = base+'/images/' + this.state.uploadImage+'?random='+time;
		return(
			<View style={styles.container}>
				<NavigationBar
					title='注册新用户'
					leftButton={<TouchableOpacity onPress={()=>this._pop()}><Text>返回</Text></TouchableOpacity>}
				/>
				<View>
					{
						!this.state.isUpLoadImg ?
						<TouchableOpacity onPress={()=>this._pickPhoto()}>
							<View style={styles.unLoad}>
								<Image source={require('../../../res/images/add_head.png')} style={styles.bar_img_radius}/>
								<Text style={styles.uploadText}>上传头像</Text>
							</View>
						</TouchableOpacity>
						:
						<TouchableOpacity onPress={()=>this._pickPhoto()}>
							<Image source={{uri:img}} style={styles.bar_img}>
								<Image source={{uri:img}} style={styles.bar_img_radius}/>
								<Text style={styles.uploadText}>点击更改</Text>
							</Image>
						</TouchableOpacity>
					}
				</View>
				
				<View style={{backgroundColor:'#fff'}}>
					<Text style={styles.bar_info}>基本信息填写</Text>
					<View style={styles.info_item}>
						<Image source={require('../../../res/images/user.png')} style={styles.info_item_img}/>
						<Text style={styles.info_item_label}>用户昵称：</Text>
						<TextInput style={{flex:1,fontSize:15}} 
							clearButtonMode='while-editing'
							autoCapitalize={'none'}
							autoCorrect={false}
							placeholder='1-20个字符，可由中文／英文组成'
							onChangeText={(text)=>{
								this.setState({
									name:text
								});
							}}
							/>
					</View>
					<View style={styles.info_item}>
						<Image source={require('../../../res/images/password.gif')} style={styles.info_item_img}/>
						<Text style={styles.info_item_label}>填写密码：</Text>
						<TextInput  style={{flex:1,fontSize:15}}
						 	autoCapitalize={'none'}
						 	autoCorrect={false}
							clearButtonMode='while-editing' placeholder='由6-12个字符组成'
							secureTextEntry={true}
							onChangeText={(text)=>{
								this.setState({
									password:text
								});
							}}
						 />
					</View>
					<View style={styles.info_item}>
						<Image source={require('../../../res/images/gender.png')} style={styles.info_item_img}/>
						<Text style={styles.info_item_label}>选择性别：</Text>
						 <RadioGroup style={{backgroundColor:'#fff',flexDirection:'row'}} selectedIndex={0} onSelect = {(index, value) => this.onSelect(index, value)}>		       
			                    <RadioButton value={0} >
			                    	<View style={{flexDirection:'row'}}>
				                        <Text style={{fontSize:16}}>男</Text>
				                    </View>
			                    </RadioButton>
			                   <RadioButton  color='#FE214C' value={1} >
			                    	<View style={{flexDirection:'row'}}>
				                        <Text style={{fontSize:16}}>女</Text>
				                    </View>
			                    </RadioButton>
	                    </RadioGroup>
					</View>
					<TouchableOpacity onPress={()=>this.choiceDate()} style={{padding:2,borderBottomWidth:Util.pixel,borderColor:'#D1D1D1',flexDirection:'row'}}>
						<Image source={require('../../../res/images/birthday.png')} style={styles.info_item_img}/>
						<Text style={styles.info_item_label}>出生年月：</Text>
						<View style={{flex:1,alignItems:'flex-end'}}>
							<Text style={styles.info_date}>{(this.state.birthday+1).indexOf('X')>-1 ?this.state.birthday: Tool.getLocalTime(this.state.birthday)}  ➜</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View>
					<Text style={{padding:12,color:'grey'}}>注册成为会员即为同意用户协议</Text>
				</View>
				<View style={{padding:20}}>
					<Button onPress={()=>this._confirmRegister()} style={styles.btn}>确认注册</Button>
				</View>
				<Modal
					animationType={'slide'}
					transparent={true}
		          	visible={this.state.isShowModal}
				>

					{
						this.state.isDate ?
						<TouchableOpacity onPress={()=>this.cancelDate()} style={{flex:1}}>
							<View  style={{backgroundColor:'#f3f3f4',top:Util.size.height*0.6,height:500}}>
								<View style={{flexDirection:'row',justifyContent:'space-between'}}>
								<Button onPress={()=>this.cancelDate()} style={{padding:10,paddingLeft:15}}>取消</Button>
								<Button onPress={()=>this.confirmDate()} style={{padding:10,paddingRight:15}}>确定</Button>
								</View>
								<DatePickerIOS
				          		  minimumDate={new Date('1950-01-01')}
				          		  maximumDate={new Date()}
						          mode="date"
						          date={parseInt(new Date(this.state.choiceBirthday).getTime())}
						       	  onDateChange={(date)=>{
						       	  	this.setState({
						       	  		choiceBirthday:date
						       	  	});
						       	  }}
						        />
				        	</View>
				        </TouchableOpacity>:null
					}
				</Modal>
				<Toast 
					ref='toast'
					position='center'
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#f3f3f4'
	},
	btn:{
		padding:10,
		marginTop:20,
		backgroundColor:'transparent',
		borderColor:'#ee735c',
		borderWidth:1,
		borderRadius:4,
		color:'#ee735c',
	},
	bar_img:{
		borderColor:'#D1D1D1',
		borderTopWidth:Util.pixel,
		height:Util.size.height*0.25,
		resizeMode:'stretch',
		width:Util.size.width,
		alignItems:'center',
		justifyContent:'center'
	},
	bar_img_radius:{
		width:70,
		height:70,
		borderRadius:35,
		borderWidth:Util.pixel,
		borderColor:'#D1D1D1'
	},
	bar_info:{
		marginTop:10,
		padding:10,
		color:'#ee735c',
		fontSize:16
	},
	info_item:{
		padding:2,
		borderBottomWidth:Util.pixel,
		borderColor:'#D1D1D1',
		flexDirection:'row'
	},
	info_item_img:{
		width:35,
		height:35,
		marginLeft:10
	},
	info_item_label:{
		lineHeight:35,
		fontSize:16,
		marginLeft:10
	},
	info_date:{
		lineHeight:35,
		color:'grey',
		marginRight:10
	},
	unLoad:{
		alignItems:'center',
		justifyContent:'center',
		height:Util.size.height*0.25,
	},
	uploadText:{
		marginTop:10,
		fontSize:15,
	}
});