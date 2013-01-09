/**
 * minimum.js
**/
var interpreter = require('./modules/interpreter.js').interpreter;
var mongoose    = require('./modules/mongoose.js').mngs;
var util        = require('./modules/util.js').util;

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

/********* prepare for twitter bot ********/
var conf = require('./conf_my.js').conf;
var twitter = require('twitter');
var hisyotan = new twitter({
    consumer_key        : conf.consumer_key,
    consumer_secret     : conf.consumer_secret,
    access_token_key    : conf.access_token,
    access_token_secret : conf.access_token_secret,
});
/******************************************/

/********* service global **********/
var _name = '';
var _now  = '';
var _rep =  {};

var _keyword = '';
/***********************************/

/************** streaming *****************/
hisyotan.stream('user',function(stream){
    console.log(util.getDateLog() + '秘書たんは起床しました！');
    stream.on('data',function(data){

        if(!wantToReply(data)) return;
        // ログを残しておく
        console.log(util.getDateLog() + '[refer] ')// + data.text)

        _name = data.user.screen_name;
        _now  = data.created_at;
        _rep  = {
          in_reply_to_status_id     : data.id,
          in_reply_to_status_id_str : data.id_str,
          in_reply_to_user_id       : data.user.id,
          in_reply_to_user_id_str   : data.user.id_str,
          in_reply_to_screen_name   : data.user.screen_name,
        };

        mongoose.findMaster(_name,function(master,is_initial){
            interpreter.process(data, master, is_initial, function(mess_type, params){
                reply(mess_type, params);
            });
        });
    });
});
/******************************************/

//function do_ignore(data){
function wantToReply(data){
    if(data.user === void 0){ // フォローリストとか最初に入ってくるので排除
        return false;
    }
/**
    if(data.in_reply_to_screen_name == 'hisyotan'){ // リプライは必ず反応する
        return true;
    }
    var keyword = getKeyword(data.text);
    if(keyword){ // 登録されてるキーワードを含むのなら反応する
        return true;
    }
**/
    return true;
}

function gambatte(){
    var mess = '@' + _name + ' がんばってね! ' + _now ;
    hisyotan.updateStatus(mess,function(data){});
}

function reply(mess_type, params){
    var mess = '';
    switch(mess_type){
        case MESS_TYPE_GAMB:
            mess = '@' + _name + ' ';
            for(var i = 0;i<params.tasks.length; i++){
                mess += params.tasks[i] + '、';
            }
            mess += 'です！がんばってね! ' + util.getTimeHash();
            break;
        case MESS_TYPE_NO_TASKS:
            mess = '@' + _name + 'さん、今やること無いみたいですよ？';
            mess += getRandomNOTASK() + util.getTimeHash();
            break;
        case MESS_TYPE_TASK:
            mess = '@' + _name + ' OK! 覚えておきますね！ ' + util.getTimeHash() ;
            break;
        case MESS_TYPE_DONE:
            mess = '@' + _name + ' おつかれさま！';
            if(params.done !== void 0){
                for(var i =0; i<params.done.length; i++){
                    mess += params.done[i] + '、';
                }
                mess += '片付けておきますねっ！';
            }
            break;
        case MESS_TYPE_INIT:
            mess = '@' + _name + 'さん、こちらこそよろしくお願いします！ ';
            break;
        case MESS_TYPE_REMOVE:
            mess = '@' + _name + ' さよならは悲しいです。(´Д⊂ｸﾞｽﾝ';
            break;
        case MESS_TYPE_OTHERS:
            mess = '@' + _name + ' はじめまして、でしょうか？秘書たんです！パートナー登録されている方のやりたいことを管理し、応援します！' + util.getTimeHash();
            break;
        case MESS_TYPE_TAIKIN:
            mess = '@' + _name + ' おしごとお疲れ様です！' + getRandomTAIKIN();
            break;
        default:
            mess = '';
        }
    console.log(util.getDateLog() + '[reply] ' + mess);
    hisyotan.updateStatus(mess,_rep,function(data){});
}

function getRandomNOTASK(){
    var serif = [
        '暇つぶしに私と遊びませんか？',
        'そういうときは寝るのが一番です！',
        'あ、ちょっと用事があるので、また後で！',
        '暇人ですかー？よくないですー',
        'カフェでも行くのはどうでしょう？え、一緒に！？ ｷｬ(//∇//) ',
        'いつもがんばってますね！'
    ];
    var index = Math.floor(Math.random() * serif.length);
    return serif[index];
}

function getRandomTAIKIN(){
    var serif = [
        '帰ったら手洗いうがいですよー',
        '今日もたくさんはたらきましたねー'
    ];
    var index = Math.floor(Math.random() * serif.length);
    return serif[index];
}
