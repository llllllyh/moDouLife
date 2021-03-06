import React , {Component} from 'react';
import{
	View,
	Text,
	Modal,
	DeviceEventEmitter
} from 'react-native';
import Picker from 'react-native-picker';

export default class SubPicker extends Component{

	static propTypes = {
		dataList:React.PropTypes.array.isRequired
	}

	constructor(){
		super();
		this.state = {
			isShowPicker:false,
			isShowModal:false
		}
	}


	_cancelPicker(){
		this.setState({isShowModal:false,isShowPicker:true});
		Picker.hide();
	}

	componentDidMount(){
		let self = this;
		this.listener = DeviceEventEmitter.addListener('isPickerShow',function(flag){
			self._pickShow();
		});
	}

	componentWillUnmount(){
		this.listener.remove();
	}

	_pickShow(){
		let self = this;
		Picker.init({
	        pickerData:this.props.dataList,
	        pickerConfirmBtnText:'确认筛选',
			pickerCancelBtnText:'取消筛选',
			pickerTitleText:'筛选条件',
			pickerFontSize:20,
	        onPickerConfirm: data => {
	        		self._cancelPicker();
				self.props.choiceOper(self.props.dataListType,data);
	        
	        },
	        onPickerCancel: data => {
	        	self._cancelPicker();
	        },
    	})
		
		this.setState({isShowModal:true,isShowPicker:true});
	    Picker.show();
	}

	render(){
		if(!this.props.dataList){
			return <View/>
		}
		return(
			<View>
				<Modal 
          			animationType={'fade'}
					transparent={true}
					visible={this.state.isShowModal}>
					<Text onPress={this._cancelPicker.bind(this)} style={{flex:1,backgroundColor:'black',opacity:0.2}} />
          		</Modal>
			</View>
		)
	}

}