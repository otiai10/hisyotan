/**
 * hisyotanの実体
**/
//-----[const]-----
var PROJ_ROOT = '/home/hiromu/node/projects/hisyotan';
var SRC_PATH  = PROJ_ROOT + '/src';
//-----------------

var fs = require('fs'),
  mngs = require('./modules/mongoose.js').mngs;

exports.secretary = {

  name     : '', // この秘書の名前
  serif    : {}, // この秘書のセリフ集
  entry    : {}, // 受信したツイート
  referer  : {}, // 発言者情報
  master   : {}, // このスレッドで相手するご主人様情報

  // setName
  setName : function(secretaryName){
    this.name = secretaryName;
  },

  // setEntry
  setEntry : function(entry){
    if(this.filterEntry(entry)){
      this.entry = entry;
      return true;
    }else{
      return false;
    }
  },

  // エントリをフィルタする
  filterEntry : function(entry){
    // streamAPI開始時の雑多なデータを排除
    if(entry === void 0 || entry.user === void 0){
      return null;
    }
    // 自分の発言を排除
    if(entry.user.screen_name === this.name){
      return null;
    }
    return entry;
  },

  // setMode
  setMode : function(mode){
    this.setName(mode);
    var path = SRC_PATH +'/'+ String(mode) + '.json';
    this.serif = getJsonFromFile(path);
  },

  // setReferer
  setReferer : function(twitterUser){
    this.referer = twitterUser;
  },

  // setMaster
  setMaster : function(master){
    this.master = master;
  },

  //---[[[async]]]---
  // 登録されているご主人様情報を返す
  checkMaster : function(masterName, f){
    // mngsに問い合わせる 
    mngs.findMasterByName(masterName,f(data));    
  },

  // 発言を解釈し、返信へdispatchする
  interpret : function(entry){
    if(this.referer.is_new_commer){
      if((this.entry.in_reply_to_screen_name == this.name) && (this.entry.text.match('--init'))){
        reply.firstGreet();
      }
      return 0;
    }

  },

  // 返信する
  reply : {

    // デイリーなリマインド
    dailyRemind : function(){

    },

    // ウィークリーなリマインド
    weeklyRemind : function(){

    },

    // todoリストを提示する
    showTodos : function(){

    },

    // 最初の挨拶
    firstGreet : function(){
      console.log(this.referer);
    },

  },

  main : function(is_debug){
    this.setReferer(this.entry.user);
    var mstr;
    this.checkMaster(this.referer.screen_name,function(master){
      if(master){
        console.log(this);
        this.setMaster(master);
      }else{
        this.referer.is_new_commer = true;
      }
      this.interpret();
    });
    //}).bind(this);とか
    //}).call(this);とか
    //}).apply(this);とかしてみたけど
  },

}

function getJsonFromFile(filepath){
  data = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(data);
}
