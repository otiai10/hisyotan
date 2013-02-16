/**
 * mongoose.js
**/

var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://localhost/test');
// define schema
var masterSchema = new mongoose.Schema({
    name      : { type: String, required: true, unique: true },
    tasks     : [ String ],
    do_weekly : { type: Boolean, default: false },
    daily     : { type: String, required: false, default: null },
    do_daily  : { type: Boolean, default: false },
    do_pdf    : { type: Boolean, default: false },
    pdf_url   : { type: String, default: null },
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

    createNewMaster : function(name, callback){
        var master = new Master({name : name});
        master.save(function(err,data){
            if(err) callback(false);
            else callback(true);
        });
    },

    findDailyMasters : function(callback){
        Master.find().where('do_daily').equals(true).exec(callback);
    },

    findWeeklyMasters : function(callback){
        Master.find().where('do_weekly').equals(true).exec(callback);
    },

    findPDFMasters : function(callback){
        Master.find().where('do_pdf').equals(true).exec(callback);
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
        Master.remove({name: master.name}, function(err,data){
            if(err) callback(false);
            else callback(true);
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

