/**
 * reminder
 *
 * crontabや、デバグのときはcliから叩かれます。hisyo_appからは呼ばれません。むしろ対比する位置づけ
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
        console.log(u.d() + i + ' Weekly done');
      }
      terminate();
    });
    break;
  case c.CLI_ARG_PDF:
    mngs.findPDFMasters(function(err, master_list){
      for(var i=0; i<master_list.length; i++){
        //console.log(master_list);
        var flag = Math.random() * 100;
        if(is_debug){
          sendRemind(master_list[i], c.REP_PDF);
        }else{
          // さすがに深夜はやめようぜ
          if(flag < c.REMIND_PDF_PERCENTAGE && !isMidnigith()){
            sendRemind(master_list[i], c.REP_PDF);
          }
        }
      }
      terminate();
    });
    break;
  default:
}

// TODO: utilに置いてもいいかもしれん
function isMidnigith(){
  var date = new Date();
  var hour = date.getHours();
  if(0 < hour && hour < 6){
    return true;
  }
  return false;
}

function sendRemind(master, pattern){
  var params = {
    'master' : master,
  };
  generate(pattern, params, secretary.serif, function(mess){
    // prepare
    text = '@' + master.name + ' ' + mess;
    if(is_debug) text = text + ' ' + u.getTimeHash();
    t.tweet( text, function(res){
      //if(is_debug) console.log(res);
    });
  });
}

/*private*/function terminate(){
  setTimeout(function(){
    process.exit();
  },60*1000);
}
