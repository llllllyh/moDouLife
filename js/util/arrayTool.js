'use strict'
module.exports = {

	//查找某个name是否存在 返回类型obj
	getObjByArray(arr , name){
		let obj = {};
		for(var item in arr){
			if(arr[item] == name){
				obj.name = arr[item];
				obj.index = item;
				return obj;
			}
		}
		return obj;
	},



	//返回我的收藏筛选类型的对应属性
	getChoiceTypeById(id){
		switch(id){
			case '0':
				return 'all';
			case '1':
				return 'r';
			case '2':
				return 'r1';
			case '3':
				return 'r2';
			case '4':
				return 'h';
			case '5':
				return 'h2';
			case '6':
				return 'h3';
			case '7':
				return 'h1';
		}
	}

}
