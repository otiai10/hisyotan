/**
 * generater
**/

//TODO: プロパティは全部直接exportsすれば、ここで変な語尾はいらない
var c = require('./modules/constants').constants,
 mngs = require('./modules/mongoose').mngs; //TODO: procedure哲学により、ここにmngsを書かない

var s = {};

//-----[[async]]-----
exports.generateText = function(pattern, params, serif, cb){

  s = serif;

  switch(pattern){
    //========== REP_LIST_TASK ==================================
    case c.REP_LIST_TASK:
      // 現在のタスクを全部取得する、で、callbackでcb();する
      getTaskListByName(params.master.name, function(tasks){
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
      addTaskToMasterName(params.master, new_tasks, function(new_tasks){
        var mess = joinTasksToText(new_tasks);
        cb(getSerif('REP_REG_TASK', [mess]));
      });
      break;
    //========== REP_DONE_TASK ================================
    case c.REP_DONE_TASK:
      // 名前に対して、タスクを削除する
      var ref_tasks = extractTasks(params.entry.text);
      removeTasksFromMasterName(params.master, ref_tasks, function(response){
        if(response.done_tasks.length !== 0){
          var mess = joinTasksToText(response.done_tasks);
          cb(getSerif('REP_DONE_TASK', [mess, response.for_example, response.left_task_num]));
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
      updateDailyRemindContent(params.master, new_daily_content, function(response){
        if(response.accepted){
          cb(getSerif('REP_UPDATE_DAILY', [new_daily_content]));
        }else{
          cb(getSerif('REP_ERROR', [new_daily_content]));
        }
      });
      break;
      // TODO: imple
    //========== REP_ENABLE_DAILY ================================
    case c.REP_ENABLE_DAILY:
      switchDailyRemind(params.master, true, function(response){
        if(response){
          cb(getSerif('REP_ENABLE_DAILY'));
        }
      });
      break;
      // TODO: imple
    //========== REP_DISABLE_DAILY ================================
    case c.REP_DISABLE_DAILY:
      switchDailyRemind(params.master, false, function(response){
        if(response){
          cb(getSerif('REP_DISABLE_DAILY'));
        }
      });
      break;
      // TODO: imple
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

/*private*/function getTaskListByName(masterName,cb){
  mngs.findMasterByName(masterName, function(res){
    cb(res.tasks);
  });
}

/*private*/function addTaskToMasterName(master,new_tasks,cb){
  for(var i=0; i<new_tasks.length; i++){
    master.tasks.push(new_tasks[i]);
  }
  mngs.saveMaster(master,function(is_success){
    if(is_success) cb(new_tasks);
  });
}

/**
 * TODO: ここのロジック部分って、procedureとして分離したほうがよくない？
**/

/*private*/function switchDailyRemind(master, do_daily, cb){
  master.do_daily = do_daily; 
  mngs.saveMaster(master, function(is_success){
      cb(is_success);
  });
}
/*private*/function removeTasksFromMasterName(master,ref_tasks,cb){
  // TODO: ここの処理かっこわるくないか？
  var current_tasks  = master.tasks;
  var new_tasks      = [];
  var done_tasks     = [];
  var not_found      = [];

  // done_tasksとnot_foundを決定する
  for(var i=0; i<ref_tasks.length; i++){
    if(in_array(ref_tasks[i], current_tasks)){
      done_tasks.push(ref_tasks[i]);
    }else{
      not_found.push(ref_tasks[i]);
    }
  }

  // new_tasks決定する
  for(var i=0; i<current_tasks.length; i++){
    if(in_array(current_tasks[i], done_tasks)){
      //console.log(current_tasks[i], 'doneなので何もしない');
    }else{
      //console.log(current_tasks[i], 'プッシする');
      new_tasks.push(current_tasks[i]);
    }
  }

  // master情報の上塗り
  master.tasks = new_tasks;

  mngs.saveMaster(master, function(is_success){
    if(is_success){
      var response = {
        'done_tasks'   :/*array*/done_tasks,
        'left_task_num':/*int*/  new_tasks.length,
        'not_found'    :/*array*/not_found,
        'for_example'  :/*string*/new_tasks.shift(),
      };
      cb(response);
    }
  });
}

/*private*/function updateDailyRemindContent(master, new_daily_content, cb){
  var response = {
    'accepted'          : false,
    'new_daily_content' : new_daily_content,
  };
  if(new_daily_content.length == 0){
    console.log('new_daily_contentが空文字列なので取り合わない。いや、ちゃんとinvalidを伝えた方がいいだろう', new_daily_content);
    cb(response);
  }else{
    master.daily = new_daily_content;
    mngs.saveMaster(master, function(is_success){
      if(is_success){
        response.accepted = true;
        cb(response);
      }else{
        cb(response);
      }
    });
  }
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

/*utility?*/function in_array(target, arr){
  for(var i=0; i<arr.length; i++){
    if(arr[i] == target){
      return arr[i];
    }
  }
  return false;
}
