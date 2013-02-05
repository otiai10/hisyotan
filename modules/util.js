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

    d : function(format){
        var date = new Date();

        var yr = date.getYear() + 1900;
        var mn = this.zeroPad(date.getMonth() + 1);
        var dt = this.zeroPad(date.getDate());
        var hr = this.zeroPad(date.getHours());
        var mi = this.zeroPad(date.getMinutes());

        switch(format){
          case 'HHmm':
            return ('['+hr+':'+mi+']');
          case 'YYYYMMDD':
            return ('['+yr+'/'+mn+'/'+dt+']');
          default:
            return ('['+yr+'/'+mn+'/'+dt+'/'+hr+':'+mi+']');
        }
    },

    in_array : function(target, arr){
      for(var i=0; i<arr.length; i++){
        if(arr[i] == target){
          return arr[i];
        }
      }
      return false;
    },

    zeroPad : function(str, order){
      switch(order){
        default:
          return String('00' + str).slice(-2);
      }
    },
};

function _0Pad(str){
    return String('00' + str).slice(-2);
}
