/**
 * reminder
 *
 * called from crontab
**/

var generate  = require('../generater.js').generateText,
    mngs      = require('../modules/mongoose.js').mngs,
    c         = require('../modules/constants').constants,
    argv      = require('argv'),
    secretary = new require('../secretary.js').secretary;

secretary.setMode('hisyotan');

// TODO: twitterモジュール部分をまとめる
// t.updateStatus()とかしたいね
/********* prepare for twitter bot ********/
var conf = require('../conf_my.js').conf;
var twitter = require('twitter');
var bot = new twitter({
    consumer_key        : conf.consumer_key,
    consumer_secret     : conf.consumer_secret,
    access_token_key    : conf.access_token,
    access_token_secret : conf.access_token_secret,
});
/******************************************/

switch(argv.run().targets.shift()){
  case c.CLI_ARG_DAILY:
    mngs.findDailyMasters(function(err, master_list){
      for(var i=0; i<master_list.length; i++){
        sendRemind(master_list[i]);
      }
    });
    break;
  case c.CLI_ARG_WEEKLY:
    mngs.findWeeklyMasters(function(err, master_list){
      for(var i=0; i<master_list.length; i++){
        sendRemind(master_list[i]);
      }
    });
    break;
  default:
}


function sendRemind(master){
  var params = {
    'master' : master,
  };
  generate(c.REMIND_DAILY, params, secretary.serif, function(mess){
    // prepare
    text = '@' + master.name + ' ' + mess;
    // update status
    bot.updateStatus( text, function(res){});
  });
}
