import {
    AsyncStorage,
} from 'react-native';


import Config from '../../util/config';


export default class RentRoomDao {
	/**
    *  获取首页的租房信息
    * **/

    getHomeRentRoomInfo(body){
    	return new Promise((resolve,reject) => {
    		let url = Config.api.base + Config.api.get_home_rent;
            Config.header.body=JSON.stringify(body);
    		fetch(url,Config.header)
    			.then((response)=>response.json())
    			.catch((error)=> {
                    reject(error);
                })
                .then((responseData)=> {
                    resolve(responseData);   
                })

    	})
    }

    /**
    *  获取查看的租房详情
    * **/
    getRentRoomDetail(id){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.get_room_detail+'/'+id;
            console.log(url)
            fetch(url,'GET')
                .then((response) => response.json())
                .catch((error) => {
                    console.log(error)
                    reject(error);
                })
                .then((responseData) =>{
                    resolve(responseData);
                })
        })
    }

    /**
    *  获取租房是否收藏
    * **/

    findRoomIsCollection(rid,uid){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.roomIsCollection + rid + '/' + uid;
            fetch(url,'GET')
                .then((response) => response.json())
                .catch((error) => {
                    reject(error);
                })
                .then((responseData) =>{
                    resolve(responseData);
                })
        })
    }

    /**
    *   租房收藏
    * **/
    saveRoomCollection(body){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.saveRoomCollection;
            Config.header.body=JSON.stringify(body);
            fetch(url,Config.header)
                .then((response) => {
                    let info = {flag:true}
                    resolve(info);
                })
                .catch((error) => {
                     reject(new Error('fail'));
                })
        })
    }

    /**
    *   取消租房收藏
    * **/

    cancelRoomCollection(rid,uid){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.cancelRoomCollection+rid+'/'+uid;
            fetch(url,'GET')
                .catch((error) => {
                    reject(error);
                })
                .then((responseData) =>{
                    let info = {flag:true}
                    resolve(info);
                })
         })
    }

    /**
    *   查看租房是否已预约
    * **/
    findThisRoomIsPay(rid){
         return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.findRoomIsPay+rid;
            fetch(url,'GET')
                .catch((error) => {
                    reject(error);
                })
                .then((responseData) =>{
                    resolve(responseData);
                })
         })
    }
   /**
    *   预约租房
    * **/

    payScoreOrderRoom(score,rid){
         return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.payScoreOrderRoom + score +  '/预约看房/'+ rid;
            fetch(url,Config.header)
            .catch((error)=> {
                reject(error);
            })
            .then((responseData) =>{
                resolve(responseData);
            })
         })
    }
    /**
    *   租房设备
    * **/
    getAllHouseConfig(){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getAllHouseConfig;
            fetch(url,'GET')
            .catch((error)=> {
                reject(error);
            })
            .then((response) => response.json())
            .then((responseData) =>{
                AsyncStorage.setItem('houseConfig',JSON.stringify(responseData),(error,result) => {
                    if(!error){
                        resolve(responseData);
                    }else{
                        reject(error);
                    }
                })
                
            })
        })
    }

    /**
    *  获取租房的筛选条件 
    **/

    getRentRoomChoiceStatus(){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getRentRoomChoiceStatus;
            console.log(url)
            fetch(url,'GET')
            .then((response) => response.json())
            .then((responseData) =>{
                resolve(responseData);  
            })
            .catch((error) => {
                reject(error);
            });
        })
    }
   

}