/**
 * mongoose.js
**/

var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://localhost/test');
// define schema
var masterSchema = new mongoose.Schema({
    name      : { type: String, require: true, unique: true },
    tasks     : [ String ],
    do_weekly : { type: Boolean, default: false },
    daily     : { type: String, require: false, default: null },
    do_daily  : { type: Boolean, default: false },
});
// create model
var Master = db.model('Master', masterSchema);

exports.mngs = {

    /**
     * @params name String
     * @return master Object, is_initial Boolean
    **/
    findMasterByName : function(name, cb){
      Master.findOne({name:name},function(err,res){
        cb(res);
      });
    },

    findMaster : function(name, callback){
        Master.findOne({ name : name },function(err, res){
            if(res === null){
                master = new Master({ name : name, });
                is_initial = true;
            }else{
                master = res;
                is_initial = false;
            }
            callback(master, is_initial);
        });
    },

    findWeeklyMasters : function(callback){
        Master.find().where('do_weekly').equals(true).exec(callback);
    },

    findDailyMasters : function(callback){
        Master.find().where('do_daily').equals(true).exec(callback);
    },

    // debug
    findAllMasters : function(callback){
        Master.find().exec(callback);
    },

    /**
     * @params master     Model
     * @return is_success Boolean
    **/
    saveMaster : function(master, callback){
        master.save(function(err,data){
            if(err) callback(false);
            else callback(true);
        });
    },

    /**
     * @params master     Model
     * @return is_success Boolean
    **/
    removeMaster : function(master, callback){
        master.remove(function(err,data){
            if(err) callback(false);
            else callback(true);
        });
    },

    /**
     * @params name      String
     * @return master    Model
    **/
    findTasksByName : function(name, callback){
        Master.findOne({name:name},function(err,res){
            if(err) callback(false);
            else callback(res);
        });
    },

    /**
     * @params task_names   Array
     * @return is_success   Bool
    **/
    doneTask : function(master, task_names, callback){
        var categorized = refreshTasks(task_names, master.tasks);
        master.tasks = categorized.new_tasks;
        master.save(function(err,data){
            if(err) callback(false);
            else callback(categorized.done_task);
        });
    },

    // 今のところ使ってない
    clearAllTasks : function(master, callback){
        master.tasks = [];
        master.save(function(err,data){
            if(err) callback(false);
            else callback(true);
        });
    },
}

// ----- utils -----
function refreshTasks(targets, tasks){
    var new_tasks = [];
    var done_task = [];
    for(var i = 0; i<tasks.length; i++){
        if(in_array(tasks[i], targets)){
            done_task.push(tasks[i]);
        }else{
            new_tasks.push(tasks[i]);
        }
    }
    return { 'new_tasks':new_tasks, 'done_task':done_task };
}

function in_array(val, arr){
    for(var i = 0; i<arr.length; i++){
        if(val == arr[i]){
            return arr[i];
        }
        return false;
    }
}
