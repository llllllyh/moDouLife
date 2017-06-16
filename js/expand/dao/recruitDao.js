import {
    AsyncStorage,
} from 'react-native';


import Config from '../../util/config';

export default class RecruitDao {
	
	/**
    *  获取首页的招聘信息
    * **/
    getHomeRecruit(){
    	return new Promise((resolve,reject) => {
    		let url = Config.api.base + Config.api.get_home_recruit;
    		fetch(url,'GET')
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
    *  获取点击的招聘信息
    * **/

    getRecruitDetail(id){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.get_recruit_detail+'/'+id;
            fetch(url,'GET')
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
    *  获取工作是否收藏
    * **/
    findRecruitIsCollection(rid,uid){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.recruitIsCollection + rid + '/' + uid;
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
    * 添加收藏
    * **/
    saveRecruitCollection(body){   
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.saveRecruitCollection;
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
    *  取消收藏
    * **/
    cancelRecruitCollection(rid,uid){
       return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.cancelRecruitCollection+rid+'/'+uid;
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
    *  所有福利
    * **/
    getAllWelfare(){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getAllWelfare;
            fetch(url,'GET')
                .catch((error) => {
                    reject(error);
                })
                .then((responseData) =>{
                     resolve(responseData);
                })
        })
    }
}