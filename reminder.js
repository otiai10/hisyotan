/**
 * reminder
 *
 * called from crontab
**/

var generate  = require('./generater').generateText,
    mngs      = require('./modules/mongoose').mngs, //ここもprocにしてmngsをここに書かない　
    c         = require('./modules/constants').constants,
    u         = require('./modules/util').util,
    t         = require('./my_bot'),
    argv      = require('argv'),
    secretary = new require('./secretary').secretary;

var _targets = argv.run().targets;
var timing   = String(_targets.shift());
var is_debug = Boolean(_targets.shift());

secretary.setMode('hisyotan');

if(is_debug) console.log('[this is debug] ' + u.d());

switch(timing){
  case c.CLI_ARG_DAILY:
    mngs.findDailyMasters(function(err, master_list){
      for(var i=0; i<master_list.length; i++){
        if(master_list[i].daily){
          sendRemind(master_list[i], c.REMIND_DAILY);
        }else{
          sendRemind(master_list[i], c.IGNORE);
        }
        console.log(u.d() + $i + ' Daily done');
      }
      terminate();
    });
    break;
  case c.CLI_ARG_WEEKLY:
    mngs.findWeeklyMasters(function(err, master_list){
      for(var i=0; i<master_list.length; i++){
        sendRemind(master_list[i], c.REMIND_WEEKLY);
        console.log(u.d() + $i + ' Weekly done');
      }
      terminate();
    });
    break;
  default:
}

proc_daily = function(sendRemind, terminate){
  mngs.findDailyMasters(function(err, master_list){
    for(var i=0; i<master_list.length; i++){
      if(master_list[i].daily){
        sendRemind(master_list[i], c.REMIND_DAILY);
      }else{
        sendRemind(master_list[i], c.IGNORE);
      }
      console.log(u.d() + $i + ' Daily done');
    }
    terminate();
  });
}

proc_weekly = function(sendRemind, terminate){
  mngs.findWeeklyMasters(function(err, master_list){
    for(var i=0; i<master_list.length; i++){
      sendRemind(master_list[i], c.REMIND_WEEKLY);
      console.log(u.d() + $i + ' Weekly done');
    }
    terminate();
  });
}

function sendRemind(master, pattern){
  var params = {
    'master' : master,
  };
  generate(pattern, params, secretary.serif, function(mess){
    // prepare
    text = '@' + master.name + ' ' + mess;
    if(is_debug) text = text + u.getTimeHash();
    t.tweet( text, function(res){
      if(is_debug) console.log(res);
    });
  });
}

/*private*/function terminate(){
  setTimeout(function(){
    process.exit();
  },20*1000);
}
