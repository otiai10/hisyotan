/**
 * daily remind
**/

var mongoose = require('../modules/mongoose.js').mngs;
var util     = require('../modules/util.js').util;

if (new Date().getDay() === 6) {
    process.exit();
}

mongoose.findDailyMasters(function(err,res){
    for(var i = 0; i<res.length; i++){
        if (res[i].daily != null && res[i].daily != '') {
        var mess = '@' + res[i].name + ' おはようございます！今日は' + util.getDateStr() +'です、' + res[i].daily + '忘れないでね！';
        console.log(mess);
        }
    }
    process.exit();
});
