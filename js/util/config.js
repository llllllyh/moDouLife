'use strict'

module.exports = {

	header:{
		method:'POST',
		credentials: 'include',
		headers:{
			'Accept':'application/json',
			'Content-Type':'application/json',
		}
	},
	api:{
		base:'http://121.40.81.208/',
		//登录
		j_login:'api/j_login',
		//验证码
		get_validate:'WeiXin/validate/image',
		//首页的招聘
		get_home_recruit:'api/homerecruit',
		//首页的租房
		get_home_rent:'api/house/find/index',
		//租房的详细
		get_room_detail:'api/house/find',
		//招聘的详细
		get_recruit_detail:'api/getrecruitmentbyid',
		//用户设置信息
		user_set:'/api/userset',
		//判断招聘是否收藏
		recruitIsCollection:'api/collection/checkiscollection/A',
		//收藏招聘
		saveRecruitCollection:'api/collection/savecollection',
		//取消收藏招聘
		cancelRecruitCollection:'api/collection/deletecollection/A',
		//判断租房是否收藏
		roomIsCollection:'api/collection/checkiscollection/H',
		//收藏租房信息
		saveRoomCollection:'api/collection/savecollection',
		//取消收藏租房信息
		cancelRoomCollection:'api/collection/deletecollection/H',
		//租房是否已支付积分预约
		findRoomIsPay:'api/checkinmanage/find/',
		//支付预约积分
		payScoreOrderRoom:'api/checkinmanage/makeappointment/',
		//获取所有的招聘福利
		getAllWelfare:'api/welfare',
		//获取所有的租房设备信息
		getAllHouseConfig:'api/houseconfig/find',
		//用户信息设置
		userInfo:{
			//修改昵称
			updateUserName:'api/updatenickname',
			//修改个性签名
			updateUserSign:'api/updateqianming',
			//修改地址
			updateUserAddress:'api/updateaddress',
			//修改性别
			updateUserSex:'api/updatesex',
		},
		//获取积分记录
		getScoreRecord:'api/scorerecord?caseid=',
		//获取租房预约
		getBookRoomRecords:'api/checkinmanage/find/',
		//获取我的收藏
		getCollectionRecords:'api/collection/findcollection/'

		
	}
}