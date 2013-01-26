/**
 * text interpreter
**/

// const
var MESS_TYPE_INIT          = 0;
var MESS_TYPE_GAMB          = 1;
var MESS_TYPE_TASK          = 2;
var MESS_TYPE_DONE          = 3;
var MESS_TYPE_NO_TASKS      = 4;
var MESS_TYPE_REMOVE        = 10;
var MESS_TYPE_REMOVE_FAILED = 11;
var MESS_TYPE_OTHERS        = 20;
//---[agressive reply]---
var MESS_TYPE_TAIKIN        = 51;
var MESS_TYPE_OHAYO         = 52;

var mongoose    = require('./mongoose.js').mngs;

exports.interpreter = {

    process : function(data, master, is_initial, callback){

        var text = data.text,
        in_reply_to = data.in_reply_to_screen_name;

        // init処理
        if(is_initial && in_reply_to == 'hisyotan'){ // マスター登録されてないひと
            if(text.match('--init') && text.match('よろしくね')){
                mongoose.saveMaster(master,function(is_success){
                    callback( MESS_TYPE_INIT );
                });
            } else {
                callback( MESS_TYPE_OTHERS );
            }
        }

        else if(text.match('@hisyotan') && in_reply_to == 'hisyotan') { // 秘書たんへのリプライに反応するパターン
            // task追加処理
            if(text.match('/&')){
                elements = text.split(/[ |　]/);
                console.log(elements);
                for(var i =0; i<elements.length; i++){
                    if(elements[i].match('hisyotan') || elements[i].match('/&')){
                        // do nothing
                    }else{
                        master.tasks.push(elements[i]);
                    }
                }
                mongoose.saveMaster(master,function(is_success){
                    callback( MESS_TYPE_TASK );
                });
            }

            // task片付け処理
            else if(text.match('--done')) {
                elements = text.split(/[ |　]/);
                var task_names = [];
                for(var i =0; i<elements.length; i++){
                    if(elements[i].match('hisyotan') || elements[i].match('--done')){
                        // do nothing
                    }else{
                        task_names.push(elements[i]);
                    }
                }
                mongoose.doneTask(master, task_names, function(is_success, done_task){
                    if(is_success) callback( MESS_TYPE_DONE, { 'done' : task_names});
                });
            }

            // マスター登録削除
            else if(text.match('--bye') && text.match('きみとはやってられん')){
                mongoose.removeMaster(master,function(is_success){
                    if(is_success){
                        callback( MESS_TYPE_REMOVE );
                    }else{
                        callback( MESS_TYPE_REMOVE_FAILED );
                    }
                });
            }

            // 良くわからないリプライ
            // task確認処理
            else {
                mongoose.findTasksByName(master.name,function(res){
                    if(res.tasks.length == 0){
                        callback( MESS_TYPE_NO_TASKS );
                    } else {
                        callback( MESS_TYPE_GAMB, { 'tasks' : res.tasks });
                    }
                });
            }
        } else { // リプライじゃないもの。積極的返信
            if (text.match(/たいきん|退勤/) && in_reply_to == null) {
                callback(MESS_TYPE_TAIKIN );
            }
            if (text.match(/おはよう|むくり|起床/) && in_reply_to == null) {
                callback(MESS_TYPE_OHAYO );
            }
        }
    },
};
