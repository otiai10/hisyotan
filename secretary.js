/**
 * hisyotanの実体
**/

//-----[module]--------------------------------------
var fs      = require('fs'),
  util      = require('./modules/util.js').util,
  mngs      = require('./modules/mongoose.js').mngs,
  generate  = require('./generater.js').generateText,
  interpret = require('./interpreter.js').interpretText,
  c         = require('./modules/constants').constants;
//---------------------------------------------------

//-----[const]---------------------------------------
var SRC_PATH  = __dirname + '/src';
//---------------------------------------------------

// TODO: twitterモジュール部分をまとめる
/********* prepare for twitter bot ********/
var conf = require('./conf_my.js').conf;
var twitter = require('twitter');
var bot = new twitter({
    consumer_key        : conf.consumer_key,
    consumer_secret     : conf.consumer_secret,
    access_token_key    : conf.access_token,
    access_token_secret : conf.access_token_secret,
});
/******************************************/

exports.secretary = {

  name     : '', // この秘書の名前
  serif    : {}, // この秘書のセリフ集
  triggers : {}, // この秘書に能動的に反応させたいトリガーワード
  entry    : {}, // 受信したツイート
  referer  : {}, // 発言者情報
  master   : {}, // このスレッドで相手するご主人様情報
  _pattern :  0,
  replytext: '',

  main : function(is_debug){

    this.setReferer(this.entry.user);
    var self = this;
    self.checkMaster(self.referer.screen_name, function(master){
      if(master){
        self.setMaster(master);
      }else{
        self.referer.is_new_commer = true;
      }
      self.reply();
    });
  },

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
    var serifpath   = SRC_PATH +'/'+ String(mode) +'/serif.json';
    var triggerpath = SRC_PATH +'/'+ String(mode)+'/triggers.json';
    this.serif      = getJsonFromFile(serifpath);
    this.triggers   = getJsonFromFile(triggerpath);
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
    mngs.findMasterByName(masterName,function(res){f(res)});    
  },

  // 発言を解釈し、返信へdispatchする
  reply : function(){

    if(this.referer.is_new_commer){
      if((this.entry.in_reply_to_screen_name == this.name) && (this.entry.text.match('--init'))){
        this._pattern = c.IGNORE;
      }
    }else{
      var is_mention = (this.entry.text.match('@'+this.name))? true:false;
      this._pattern  = interpret(this.entry.text, is_mention, this.name, this.triggers); 
    }

    //-- LOG --
    console.log(util.d() + this._pattern + ' <<< ' +this.entry.text );

    if(this._pattern != c.IGNORE){
      var self = this;
      var params = {
        "entry"  : self.entry,
        "master" : self.master
      };
      generate(self._pattern, params, self.serif, function(res){
        self.replytext = res;
        self.send();
      });
    }

  },

  send : function(){
    // prepare
    text = '@' + this.master.name + ' ' + this.replytext + ' ' + util.getTimeHash();
    var params = { in_reply_to_status_id: this.entry.id_str, };
    // update status
    bot.updateStatus( text, params, function(res){});
  },


  setPattern: function(pattern){
    this._pattern = pattern;
  },

}

function getJsonFromFile(filepath){
  data = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(data);
}
