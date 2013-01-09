/**
 * weekly remind
**/

var mongoose = require('../modules/mongoose.js').mngs;
var util     = require('../modules/util.js').util;

mongoose.findWeeklyMasters(function(err,res){
    for(var i = 0; i<res.length; i++){
        if (res[i].tasks.length != 0) {
            var mess = '@' + res[i].name + ' 今週末の予定です。';
            for (var j=0;j<res[i].tasks.length;j++){
                mess += res[i].tasks[j] + '、';
            }
            mess += 'です！応援してます!!';
            console.log(mess);
        }
    }
    process.exit();
});
