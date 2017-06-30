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
		base:'http://test.modoukj.com/weixin/',
		//base:'http://m.modoukj.com/weixin/',
		//base:'http://192.168.10.17:8080/',
		//登录
		j_login:'api/j_login',
		//注册用户
		registerUser:'api/register',
		//获取注册短信验证码
		getRegisterCode:'api/sendMessage',
		//获取找回密码的验证码
		getFindPwdCode:'api/sendCode',
		//验证号码和验证码
		checkInPhone:'api/rePhone',
		//验证码
		get_validate:'validate/image',
		//图片上传
		uploadPicURL:'api/uploadimg',		
		//首页的招聘
		get_home_recruit:'api/homerecruit',
		//首页的租房
		get_home_rent:'api/house/find/index',
		//租房的详细
		get_room_detail:'api/house/find',
		//招聘的详细
		get_recruit_detail:'api/getrecruitmentbyid',
		//兼职的详细
		get_partJob_detail:'api/getpluralityrecruitbyid',
		//用户设置信息
		user_set:'api/userset',
		//判断招聘是否收藏
		recruitIsCollection:'api/collection/checkiscollection/',
		//收藏招聘
		saveRecruitCollection:'api/collection/savecollection',
		//取消收藏招聘
		cancelRecruitCollection:'api/collection/deletecollection/',
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
			//修改区域
			updateUserArea:'api/updatedistrict',
			//修改密码
			updateUserPwd:'api/updatePwd',
			//修改出生日期
			updateUserBirthday:'api/updatebirthday',
		},
		//获取积分记录
		getScoreRecord:'api/scorerecord?caseid=',
		//获取租房预约
		getBookRoomRecords:'api/checkinmanage/find/',
		//获取我的收藏
		getCollectionRecords:'api/collection/findcollection/',
		//获取预约记录的筛选条件
		getRentRoomChoiceStatus:'api/CheckInStatus',
		//取消预约
		cancelBookOper:'api/checkinmanage/cancelappointment/',
		//获取全职一级条件
		getAllWorkMenu:'api/industry',
		//获取全职菜单
		getSecondRecruitByWork:'api/professionnal/',
		//获取兼职一级条件
		getPartTimeJobMenu:'api/plurality',
		//获取全职的所有信息,可筛选
		getDetailWorkList:'api/recruitment',
		//获取兼职的所有信息，可筛选
		getDetailJobList:'api/pluralityrecruit',
		//获取庭室信息
		getRoomNum:'api/houseroomnum/find',
		//获取长租房列表
		getLongRoomList:'api/house/find/long',
		//获取月租房列表
		getMonthRoomList:'api/house/find/short'
	}
}