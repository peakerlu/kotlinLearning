//var api = "http://192.168.2.242:8080/wiseYinZhou_war_exploded/";
//var api = "http://192.168.2.228:8589/wiseYinZhou_war_exploded/";
// var api = "http://61.130.101.39:8088/mq/common/";
var api = "http://192.168.2.220:8877/Digital_shanxi_war_exploded/";
//var api = "http://192.168.2.237:8082/Digital_shanxi_war_exploded/";
//var api = "http://112.17.127.75:8007/";
function isEmpty(value){
    if(value == null || value == "null" || value == "undefined" || value == undefined || value == ""){
        return '-';
    }
    return value;
}
Date.prototype.format = function (format) {
    var o = {
        "y+": this.getFullYear(),//year
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "H+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}