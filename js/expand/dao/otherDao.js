import Config from '../../util/config';

export default class RecruitDao {

	//首页轮播图
	getHomeAd(){
		return new Promise((resolve,reject) => {
			let url = Config.api.base + Config.api.homeAd;
			fetch(url,'GET')
				.then(res => res.json())
          		.then(json =>{	
          			resolve(json);
      			})
      			.catch((error) => {
      				reject(error);
      			})
		})
	}

}