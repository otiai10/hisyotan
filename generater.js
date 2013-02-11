/**
 * generater
**/

var c = require('./modules/constants').constants,
 proc = require('./procedure');

var bot = new require('./modules/twitter'); //だってnode_twitterモジュールにfollow無いぽいだもん

var s = {};

//-----[[async]]-----
exports.generateText = function(pattern, params, serif, cb){

  s = serif;

  switch(pattern){
    //========== REP_HELP =======================================
    case c.REP_HELP:
      cb(getSerif('REP_HELP'));
      break;
    //========== REP_INIT_PARTNERSHIP ===========================
    case c.REP_INIT_PARTNERSHIP:
      bot.follow({ screen_name: params.master.name },function(err,data){
        proc.initPartnership(params.master.name, function(is_success){
          if(is_success){
            cb(getSerif('REP_INIT_PARTNERSHIP',[params.master.name]));
          }else{
            cb(getSerif('REP_ERROR'));
          }
        });
      });
      break;
    //========== REP_TERMINATE_PARTNERSHIP ======================
    case c.REP_TERMINATE_PARTNERSHIP:
      proc.terminatePartnership(params.master, function(is_success){
        if(is_success){
          bot.leave({ screen_name: params.master.name },function(err,data){});
          cb(getSerif('REP_TERMINATE_PARTNERSHIP'));
        }else{
          cb(getSerif('REP_ERROR'));
        }
      });
      break;
    //========== REP_LIST_TASK ==================================
    case c.REP_LIST_TASK:
      // 現在のタスクを全部取得する、で、callbackでcb();する
      proc.getTaskListByName(params.master.name, function(tasks){
        if(tasks.length == 0){
          cb(getSerif('REP_LIST_VACANT'));
        }else{
          var mess = joinTasksToText(tasks);
          cb(getSerif('REP_LIST_TASK', [mess]));
        }
      });
      break;
    //========== REP_REG_TASK ==================================
    case c.REP_REG_TASK:
      // 名前に対して、タスクを付加する
      var new_tasks = extractTasks(params.entry.text);
      proc.addTaskToMasterName(params.master, new_tasks, function(new_tasks){
        var mess = joinTasksToText(new_tasks);
        cb(getSerif('REP_REG_TASK', [mess]));
      });
      break;
    //========== REP_DONE_TASK ================================
    case c.REP_DONE_TASK:
      // 名前に対して、タスクを削除する
      var ref_tasks = extractTasks(params.entry.text);
      proc.removeTasksFromMasterName(params.master, ref_tasks, function(response){
        if(response.done_tasks.length !== 0){
          var mess = joinTasksToText(response.done_tasks);
          cb(getSerif('REP_DONE_TASK', [mess, response.for_example, response.left_tasks.length]));
        }
        if(response.not_found.length !== 0){
          var mess = joinTasksToText(response.not_found);
          cb(getSerif('REP_TASK_NOTFOUND', [mess]));
        }
      });
      break;
    //========== REP_UPDATE_DAILY ================================
    case c.REP_UPDATE_DAILY:
      var new_daily_content = joinTasksToText(extractTasks(params.entry.text), {"cut_tail":true});
      proc.updateDailyRemindContent(params.master, new_daily_content, function(response){
        if(response.accepted){
          cb(getSerif('REP_UPDATE_DAILY', [new_daily_content]));
        }else{
          cb(getSerif('REP_ERROR', [new_daily_content]));
        }
      });
      break;
    //========== REP_ENABLE_DAILY ================================
    case c.REP_ENABLE_DAILY:
      proc.switchDailyRemind(params.master, true, function(response){
        if(response){
          cb(getSerif('REP_ENABLE_DAILY'));
        }
      });
      break;
    //========== REP_DISABLE_DAILY ================================
    case c.REP_DISABLE_DAILY:
      proc.switchDailyRemind(params.master, false, function(response){
        if(response){
          cb(getSerif('REP_DISABLE_DAILY'));
        }
      });
      break;
    //========== REP_ENABLE_WEEKLY ================================
      // TODO: imple
    //========== REP_DISABLE_WEEKLY ================================
      // TODO: imple
    //========== TRIGGER_TAIKIN ===============================
    case c.TRIGGER_TAIKIN:
      cb(getSerif('TRIGGER_TAIKIN'));
      break;
    //========== TRIGGER_OHAYO ================================
    case c.TRIGGER_OHAYO:
      cb(getSerif('TRIGGER_OHAYO'));
      break;
    //========== TRIGGER_OYASUMI ==============================
    case c.TRIGGER_OYASUMI:
      cb(getSerif('TRIGGER_OYASUMI'));
      break;
    //========== REMIND_DAILY =================================
    case c.REMIND_DAILY:
      var mess = params.master.daily;
      cb(getSerif('REMIND_DAILY', [mess]));
      break;
    //========== REMIND_WEEKLY ================================
    case c.REMIND_WEEKLY:
      var mess = joinTasksToText(params.master.tasks);
      if(params.master.tasks.length == 0){
        cb(getSerif('REP_LIST_VACANT'));
      }else{
        cb(getSerif('REMIND_WEEKLY', [mess]));
      }
      break;
    case c.IGNORE:
    default:
      // do nothing
  }
};

/*private*/function getSerif(serifhash, params){
  if(params == void 0){
    params = [];
  }
  var len  = s[serifhash].length;
  var rand = Math.floor(Math.random() * len);
  var str  = s[serifhash][rand];
  for(var i=0; i<params.length; i++){
    var key = '%{'+i+'}';
    str = str.split(key).join(params[i]);
  }
  return str;
}
/*private*/function joinTasksToText(tasks, opt){
  if(opt == void 0){
    opt = {};
  }
  var mess = '';
  for(var i=0; i<tasks.length; i++){
    mess += tasks[i] + s.MISC_TASK_DELIMITER;
  }
  if(opt.cut_tail){
    mess = mess.replace(/.$/,'');
  }
  return mess;
}

/*private*/function extractTasks(text){
  var elms = text.split(/[ |　]/);
  var ref_tasks = [];
  for(var i=0; i<elms.length; i++){
    if(
      elms[i].match('@') // 秘書へのメンション部分だから
      || elms[i].match(c.FLAG_ADD) // タスク付加フラグそのものだから
      || elms[i].match(c.FLAG_DONE) // タスク片付けフラグそのものだから
      || elms[i].match(c.FLAG_UPDATE_DAILY) // デイリーリマインド登録フラグそのものだから
    ){
      // do nothing
    }else{
      ref_tasks.push(elms[i]);
    }
  }
  return ref_tasks;
}

/*private*/function in_array(target, arr){
  for(var i=0; i<arr.length; i++){
    if(arr[i] == target){
      return arr[i];
    }
  }
  return false;
}
