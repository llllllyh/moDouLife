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
	},
	//date返回年月日
	createDateData() {
        let date = [];
        for(let i=1950;i<2050;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

}
