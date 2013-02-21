/**
 * generaterから使われるProcedure
**/

// required
var c = require('./modules/constants').constants,
 mngs = require('./modules/mongoose').mngs,
 exec = require('child_process').exec,
 path = require('path'),
 conf = require('./conf_my').conf;

exports.initPartnership = function(masterName, cb){
  mngs.createNewMaster(masterName,function(is_success){
    cb(is_success);
  });
}

exports.terminatePartnership = function(master, cb){
  mngs.removeMaster(master, function(is_success){
    cb(is_success);
  });
}

exports.getTaskListByName = function(masterName,cb){
  mngs.findMasterByName(masterName, function(res){
    cb(res.tasks);
  });
}

exports.addTaskToMasterName = function(master,new_tasks,cb){
  for(var i=0; i<new_tasks.length; i++){
    master.tasks.push(new_tasks[i]);
  }
  mngs.saveMaster(master,function(is_success){
    if(is_success) cb(new_tasks);
  });
}

exports.switchDailyRemind = function(master, do_daily, cb){
  master.do_daily = do_daily; 
  mngs.saveMaster(master, function(is_success){
      cb(is_success);
  });
}

exports.switchWeeklyRemind = function(master, do_weekly, cb){
  master.do_weekly = do_weekly; 
  mngs.saveMaster(master, function(is_success){
      cb(is_success);
  });
}

exports.removeTasksFromMasterName = function(master,ref_tasks,cb){
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
        'left_tasks'   :/*array*/new_tasks,
        'not_found'    :/*array*/not_found,
        'for_example'  :/*string*/new_tasks.shift(),
      };
      cb(response);
    }
  });
}

exports.updateDailyRemindContent = function(master, new_daily_content, cb){
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

exports.switchPDFRemind = function(master, do_pdf, cb){
  master.do_pdf = do_pdf; 
  mngs.saveMaster(master, function(is_success){
      cb(is_success);
  });
}

/*
 * @return: res : {
 *            chunk : テキスト断片 or false
 *            url   : pdfへのリンク,
 *          }
**/
exports.extractPDFText = function(masterName, cb){
  mngs.findMasterByName(masterName, function(master){
    if(master){
      if(master.do_pdf){
        //fileの存在をチェック
        file_path = conf.PDF_ROOT + master.name + conf.PDF_SUFFIX;
        path.exists(file_path, function(exists) {
          if(exists){
            // PDFからテキストを抽出して云々
            cmd = generateCommand(file_path);
            exec(cmd, function(err, stdout, stderr){
              var max = stdout.length - c.CUT_TAIL;
              var _offset = Math.floor(Math.random() * (max - c.CHUNK_LEN));
              var chunk = stdout.slice( _offset, _offset + c.CHUNK_LEN);
              var url = conf.URL_ROOT + master.name + conf.PDF_SUFFIX;
              cb(chunk,url);
            });
          }else{
            console.log('マスターはいたけど、fileはなかった');
          }
        });
      }else{
        console.log('PDFがonじゃない');
      }
    }else{
      console.log('マスターが見つからない');
    }
  });
}

/*private*/function generateCommand(file_path){
  return "ruby " + __dirname + "/uploader/pdfParser.rb " + file_path + " | sed 's/ //g' | tr -d \\\\n";
}

/*private*/function in_array(target, arr){
  for(var i=0; i<arr.length; i++){
    if(arr[i] == target){
      return arr[i];
    }
  }
  return false;
}
