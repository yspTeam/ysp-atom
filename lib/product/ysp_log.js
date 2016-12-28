'use babel';

var log_log = 1;
var log_error = 2;
var log_warning = 3;
var log_info = 4;
var log_debug = 5;

function ysp_log(type, l) {
    if (l.length > 0) {
        var log_text = formatDate(new Date(), "[yyyy-M-d hh:mm:ss:fff]") + ' ' + l;
        if (type == log_log) {
            console.log(log_text);
        } else if (type == log_error) {
            console.error(log_text);
        } else if (type == log_warning) {
            console.warn(log_text);
        } else if (type == log_info) {
            console.info(log_text);
        } else if (type == log_debug) {
            console.debug(log_text);
        }
    }
}

function formatDate(date, format) {
    var paddNum = function(num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }
        //指定格式字符
    var cfg = {
        yyyy: date.getFullYear() //年 : 4位
            ,
        yy: date.getFullYear().toString().substring(2) //年 : 2位
            ,
        M: date.getMonth() + 1 //月 : 如果1位的时候不补0
            ,
        MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
            ,
        d: date.getDate() //日 : 如果1位的时候不补0
            ,
        dd: paddNum(date.getDate()) //日 : 如果1位的时候补0
            ,
        hh: date.getHours() //时
            ,
        mm: date.getMinutes() //分
            ,
        ss: date.getSeconds() //秒
            ,
        fff: date.getMilliseconds() //秒
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function(m) {
        return cfg[m];
    });
}

exports.ysp_log = ysp_log;
