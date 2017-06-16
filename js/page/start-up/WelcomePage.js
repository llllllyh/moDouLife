import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage
} from 'react-native';


import HomePage from '../HomePage';
import IndexPage from '../IndexPage';

import Util from '../../util/util';
export default class WelcomePage extends Component{

	constructor(props){
		super(props);
		this.state = {
			isLogined:''
		}
	}

	_asyncShowComponent(){

	}

	componentDidMount(){
		let showComponent ;
		AsyncStorage.getItem('user')
			.then((data) => {
				let isLogined;
				if(!data){
					showComponent=IndexPage;
				}else{
					showComponent=HomePage;
				}
			})
			.then(
					setTimeout(()=>{
						this.timer=this.props.navigator.resetTo({
							component:showComponent
						})
					},1500)
				)
	}

	componentWillUnmount(){
		this.timer&&clearTimeout(this.timer);
	}

	render(){
		return(
			<View style={styles.container}>
				<Image style={styles.wel_image} source={require('../../../res/images/show_bg_pic.png')} />
			</View>
		)
	}

}

const styles = StyleSheet.create({

	container:{
		flex:1
	},
	wel_image:{
		width:Util.size.width,
		height:Util.size.height,
	}
});