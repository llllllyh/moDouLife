import React , {Component} from 'react';
import {
	Text,
	View,
	Modal,
	DeviceEventEmitter,
	TouchableOpacity,
	StyleSheet,
	Image
} from 'react-native';
import NavigationBar from './NavigationBar';
import CheckBox from 'react-native-check-box';
import Util from '../util/util';
export default class ChoiceFilter extends Component{

	static propTypes = {
		configList:React.PropTypes.array.isRequired
	}

	constructor(){
		super();
		this.state = {
			isShow:false,
			checkedArr:[]
		}
	}

	_chlickCheckBox(name){
		let arr = this.state.checkedArr;
		let index = arr.findIndex((currentItem) => currentItem == name);
		if(index>-1){
			arr.splice(index,1)
		}else{
			arr.push(name)
		}
		this.props.addCheckedList(arr);
	}

	componentDidMount(){
		this.listener = DeviceEventEmitter.addListener('isModalShow',(flag)=>{
			this.setState({
				isShow:true
			});
		})
	}

	componentWillUnmount(){
		this.listener.remove();
	}



	renderView() {
        if (!this.props.configList || this.props.configList.length === 0)return;
        var len = this.props.configList.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.props.configList[i])}
                        {this.renderCheckBox(this.props.configList[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.props.configList[len - 2]) : null}
                    {this.renderCheckBox(this.props.configList[len - 1])}
                </View>
            </View>
        )
        return views;

    }

    renderCheckBox(data) {
        let leftText = data.name;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                isChecked={this.props.checkedList.findIndex((currentItem) => currentItem == data.name)>-1?true:false}
                leftText={leftText}
                onClick={this._chlickCheckBox.bind(this,data.name)}
                checkedImage={<Image source={require('../../res/images/ic_check_box.png')}
                				style={{tintColor:'#7AC5CD'}}/>}
                                     
                unCheckedImage={<Image source={require('../../res/images/ic_check_box_outline_blank.png')}
                				style={{tintColor:'#7AC5CD'}}/>}
            />);
    }

    cancelModal(){
    	this.setState({
    		isShow:false
    	});
    }

    render(){
    	console.log(this.props.configList)
    	return(
			<Modal 
				animationType={'fade'}
				transparent={false}
				visible={this.state.isShow}
				>
				<NavigationBar title='选择筛选条件'
					leftButton={<TouchableOpacity onPress={()=>this.cancelModal()}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}
				/>
				{this.renderView()}
			</Modal>
    	)
    }
}

const styles = StyleSheet.create({
	item: {
        flexDirection: 'row',
        borderBottomWidth:Util.pixel,
        borderColor:'#D1D1D1'
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    bar_btn:{
    	marginLeft:10,
    	color:'#fff'
    }
})