import {
    AsyncStorage,
} from 'react-native';


import Config from '../../util/config';

export default class UserDao {

	 /**
     * 用户登录操作
     * **/
	userLoginOper(params){
		return new Promise((resolve,reject) => {
			let url = Config.api.base+Config.api.j_login+'?'+params;
			fetch(url,Config.header)
				  .then((response)=>response.json())
                    .catch((error)=> {
                        reject(new Error('请检查你的网络连接是否正确！'));
                    })
                    .then((responseData)=> {
                    	if(responseData.errmsg!==undefined){
                    		reject(new Error('帐号或密码错误！'));
                    	}else{
                            AsyncStorage.setItem('user',JSON.stringify(responseData),(error,result) => {
                                if(!error){
                                    resolve(responseData);   
                                }else{
                                    reject(new Error('帐号或密码错误！'));
                                }
                            })
                        }   
                    })
		})
	}

     /**
     * 用户设置
     * **/
     userInfoSet(){
        return new Promise((resolve,reject) => {
            let url=Config.api.base + Config.api.user_set;
            fetch(url,'GET')
            .then((response)=>response.json())
            .catch((error)=> {
                 reject(error);
            })
            .then((data)=> {
                let info = {id:data.id,score:data.score,nickName:data.nickName,
                        address:data.address,qianMing:data.qianMing,
                        sex:data.sex,vipDeadLine:data.vipDeadLine,
                        myImg:data.myImg,birthday:data.birthday,
                        district:data.district}
                AsyncStorage.setItem('userInfo',JSON.stringify(info),(error,result) => {
                    if(!error){
                        resolve(data); 
                    }else{
                        reject(error);
                    }
                })
                
            })
        })
        
     }  

     /**
     *  获取用户的积分纪录
     **/
     getScoreRecord(id){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getScoreRecord + id;
            fetch(url,'GET')
            .then(response => response.json())
            .catch((error)=> {
                reject(error);
            })
            .then((responseData)=> {
                resolve(responseData);
            })
        })
     }

    /**
    *  获取用户的收藏纪录
    **/
    getCollectionRecords(uid,type){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getCollectionRecords + uid + '/' + type;
            fetch(url,'GET')
            .then(response => response.json())
            .catch((error)=> {
                reject(error);
            })
            .then((responseData)=> {
                resolve(responseData);
            })
        })
     }
     /**
     *  获取预约记录
     **/
    getBookRoomRecords(id,pageNum){
        return new Promise((resolve,reject) => {
            let url = Config.api.base + Config.api.getBookRoomRecords +id+"/"+pageNum+"/"+20;
            fetch(url,'GET')
                .then(json => {
                    resolve(json);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

     /**
     *  用户信息修改
     **/
     updateUser(username,newVal,type){
        return new Promise((resolve,reject) => {
            let url = '';
            if(type === 'name'){
                 url = Config.api.base + Config.api.userInfo.updateUserName + '?username='+username+'&nickName='+newVal;
            }else if(type === 'sign'){
                 url = Config.api.base + Config.api.userInfo.updateUserSign + '?username='+username+'&qianming='+newVal;
            }else if(type === 'address'){
                 url = Config.api.base + Config.api.userInfo.updateUserAddress + '?username='+username+'&address='+newVal;
            }else if(type === 'sex'){
                 url = Config.api.base + Config.api.userInfo.updateUserSex + '?username='+username+'&sex='+newVal;
            }
         
            fetch(url,'GET')
               .then((response)=>response.json())
                .catch((error)=> {
                     reject(error);
                })
                .then((data)=> {
                    this.userInfoSet();
                    resolve(data);
                })
        })
     }
}