/**
 * util
**/

var week_day = ['日','月','火','水','木','金','土'];

exports.util = {

    // 重複投稿にならないように一日だけ回避すればいいんでしょ
    getTimeHash : function(){
        var ts = Math.round((new Date()).getTime() / 1000);
        ts = String(ts).slice(-5);
        return ts;
    },

    getDateStr : function(){
        var date = new Date();

        var yr = date.getYear() + 1900;
        var mn = date.getMonth() + 1;
        var dt = date.getDate();
        var dy = date.getDay();

        return (yr+'/'+mn+'/'+dt+'('+week_day[dy]+'曜日)');
    },

    getDateLog : function(){
        var date = new Date();

        var yr = date.getYear() + 1900;
        var mn = date.getMonth() + 1;
        var dt = date.getDate();
        var hr = date.getHours();
        var mi = date.getMinutes();

        return ('['+yr+'/'+mn+'/'+dt+'/'+hr+':'+mi+']');
    },

    d : function(){
        var date = new Date();

        var yr = date.getYear() + 1900;
        var mn = _0Pad(date.getMonth() + 1);
        var dt = _0Pad(date.getDate());
        var hr = _0Pad(date.getHours());
        var mi = _0Pad(date.getMinutes());

        return ('['+yr+'/'+mn+'/'+dt+'/'+hr+':'+mi+']');
    },

};

function _0Pad(str){
    return String('00' + str).slice(-2);
}
