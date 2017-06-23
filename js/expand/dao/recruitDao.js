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

    getRecruitDetail(id,type){
        return new Promise((resolve,reject) => {
            let url ;
            if(type === 'all'){
                url = Config.api.base + Config.api.get_recruit_detail+'/'+id;
            }else{
                url = Config.api.base + Config.api.get_partJob_detail+'/'+id;
            }
            console.log(url)
            fetch(url,'GET')
                 .then((response)=>response.json())
                    .then((responseData)=> {
                        console.log(responseData)
                        resolve(responseData);   
                    })
                    .catch((error)=> {
                        console.log(error)
                        reject(error);
                    })
        })
        
    }


    /**
    *  获取工作是否收藏
    * **/
    findRecruitIsCollection(rid,uid,type){
        return new Promise((resolve,reject) => {

            let url = Config.api.base + Config.api.recruitIsCollection+ type + rid + '/' + uid;
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
    cancelRecruitCollection(rid,uid,type){
       return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.cancelRecruitCollection+type+rid+'/'+uid;
            fetch(url,'GET')
                .then((responseData) =>{
                    let info = {flag:true}
                    resolve(info);
                })
                 .catch((error) => {
                    reject(error);
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

    /**
    *   筛选条件
    **/
    getRecruitMenu(type){
        return new Promise((resolve,reject) => {
            let url = '';
            if(type === 'all'){
                url = Config.api.base + Config.api.getAllWorkMenu;
            }else if(type === 'part'){
                url = Config.api.base + Config.api.getPartTimeJobMenu;
            }
            
            fetch(url,'GET')
                .then(response => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    /**
    *   获取二级菜单
    **/
    getRecruitSecondMenu(id){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getSecondRecruitByWork + id;
            fetch(url,'GET')
                .then(response => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    getDetailRecruitmentList(body,type){
        return new Promise((resolve,reject) => {
            let url ; 
            if(type !== 'part'){
                url = Config.api.base + Config.api.getDetailWorkList;
            }else{
                url =Config.api.base + Config.api.getDetailJobList;
            }
          

            console.log(url)
            let ConfigHeader = Config.header;
            ConfigHeader.body = JSON.stringify(body);
            fetch(url,ConfigHeader)
                .then(response => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((error) => {
                    reject(error);
                })
        })
       
    }

}