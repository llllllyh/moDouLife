'use strict'

 
var binarynum =[];


module.exports = {

	//二进制转换
    changeBinary(welfareData,data){
        let allWelfare ={};
    	let welfareF=[];
        let welfareR=[];
     
        let self = this;
        var bin = data;
        var binary = bin.toString(2);
        //把数据转成二进制数
        for (var i = 0; i < welfareData.length - binary.length; i++) {
            binarynum[i] = 0;
        }
        for (var i = 0; i < binary.length; i++) {
            binarynum[welfareData.length - binary.length + i] = binary[i];
        }
        var r = 0;
        for(let item in welfareData){
            if (binarynum[r] == 1) {
                if (welfareData[item].welfareOrRequire == true) {
                    welfareF.push(welfareData[item].name)

                }else if (welfareData[item].welfareOrRequire == false) {
                    welfareR.push(welfareData[item].name)
                }
            }
            r++;
        };
        allWelfare.welfareF=welfareF;
        allWelfare.welfareR=welfareR;
        return allWelfare;
    },

    //圆周率
    getRad(d){
        return d*Math.PI/180.0;
    },
   
    
    //经纬度距离计算
    getGreatCircleDistance(position1,position2){
        let radLat1 = this.getRad(position1.latitude);
        let radLat2 = this.getRad(position2.latitude);
        
        var a = radLat1 - radLat2;
        var b = this.getRad(position1.longitude) - this.getRad(position2.longitude);
        
        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s*6378137.0;
        s = Math.round(s*10000)/10000.0;
        if(s<10000){
            return s.toFixed(0) + '米内';
        }else{
            return (s/1000).toFixed(0)+ '千米内';
        }
    },

    getLocalTime(nS) {   
        let data = new Date(nS);
        return data.getFullYear() + "/" + (data.getMonth() + 1) + "/" + data.getDate() ;     
    },

    forDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let date1 = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        date = year + "-" + month + "-" + date1 + " " + hour + ":" + minutes + ":" + second;
        return date;
    }

	


}