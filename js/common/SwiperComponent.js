import React,{Component} from 'react';
import{
	View,
	StyleSheet,
	Text
}from 'react-native';

import Util from '../util/util';

import Swiper from 'react-native-swiper';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
const SwiperComponent = (props) => {

	

	return(
		<View style={styles.container}>
			<Swiper
				height={Util.size.height*0.3}
				autoplay={true}
				dot={<View style={styles.dot} />}
				activeDot={<View style={styles.activeDot}/>}
				autoplayTimeout={2.5}
			>
			{
				props.banners.map((img,index) => {
					return (
						<View key={index}>
							<Image
							    indicator={Progress.Circle}
							    indicatorProps={{
								    size: 50,
								    color: 'rgba(150, 150, 150, 1)',
								    unfilledColor: 'rgba(200, 200, 200, 0.2)'
								}} style={styles.image} source={{uri:img}}/>
						</View>
					)
				})
			}
			</Swiper>
		</View>
	)
}


const styles = StyleSheet.create({
	container:{
		flex:1,
	},
	image:{
		resizeMode:'stretch',
		width:Util.size.width,
		height:Util.size.height*0.3
	},
	dot:{
		 width:10,
		 height:10,
		 backgroundColor:'transparent',
		 borderColor:'#ff6600',
		 borderRadius:7,
		 borderWidth:1,
		 marginLeft:12,
		 marginRight:12,
	},
	activeDot:{
		width:12,
		height:12,
		borderWidth:1,
		marginRight:12,
		marginLeft:12,
		borderRadius:7,
		borderColor:'#ff6600', 
		backgroundColor:'#ee735c'
	},
})

export default SwiperComponent;