/**
 * procedure
**/

var c = require('./modules/constants').constants,
 mngs = require('./modules/mongoose.js').mngs;

//-----[[async]]-----
exports.generateText = function(pattern, params, serif, cb){
  switch(pattern){
    //========== REP_LIST_TASK
    case c.REP_LIST_TASK:
      // 現在のタスクを全部取得する、で、callbackでcb();する
      setTimeout(function(){ //getTasksByName
        cb(getSerif(serif, 'REP_LIST_TASK'));
      },100);
      break;
    //========== REP_REG_TASK
    case c.REP_REG_TASK:
      // 名前に対して、タスクを付加する
      setTimeout(function(){ //appendTasksByName
        cb('OK,覚えておきますね、params的な');
      },100);
      break;
    //========== REP_DONE_TASK
    case c.REP_DONE_TASK:
      // 名前に対して、タスクを削除する
      setTimeout(function(){ //removeTasksByName
        cb('お疲れさま！params,片付けておきますねっ');
      },100);
      break;
    //========== TRIGGER_TAIKIN
    case c.TRIGGER_TAIKIN:
      var params = ["パラム0", "パラム1", "パラム2", "パラム3"];
      cb(getSerif(serif, 'TRIGGER_TAIKIN', params));
      break;
    //========== TRIGGER_OHAYO
    case c.TRIGGER_OHAYO:
      cb(getSerif(serif, 'TRIGGER_OHAYO'));
      break;
    //========== TRIGGER_OYASUMI
    case c.TRIGGER_OYASUMI:
      cb(getSerif(serif, 'TRIGGER_OYASUMI'));
      break;
    //========== REMIND_WEEKLY
    case c.REMIND_WEEKLY:
      break;
    case c.IGNORE:
    default:
      // break do nothing
  }
};

exports.interpret = function(text, is_mention, triggers){

  return c.REP_LIST_TASK;

  if(!is_mention){
    return getTriggerPattern(text, triggers);
  }


  return c.SAMPLE_PATTERN_NOT_USED;

}; 

function getTriggerPattern(text, triggers){
  for(var i in triggers){
    if(text.match(i)){
      return triggers[i];
    }
  }
  return c.IGNORE;
}

function getSerif(serif, serifhash, params){
  if(params == void 0){
    params = [];
  }
  var len  = serif[serifhash].length;
  var rand = Math.floor(Math.random() * len);
  var str  = serif[serifhash][rand];
  for(var i=0; i<params.length; i++){
    var key = '%{'+i+'}';
    str = str.split(key).join(params[i]);
  }
  return str;
};
