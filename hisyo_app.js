/**
 * app.js
**/
//-----[const]-----
var PROJ_ROOT = '/home/hiromu/node/projects/hisyotan';
var SRC_PATH  = PROJ_ROOT + '/src';
//-----------------

var util = require('./modules/util.js').util,
    conf = require('./conf_my.js').conf,
    argv = require('argv'),
 twitter = require('twitter');


var exec = require('child_process').exec;

var hisyotan = new twitter({
  consumer_key        : conf.consumer_key,
  consumer_secret     : conf.consumer_secret,
  access_token_key    : conf.access_token,
  access_token_secret : conf.access_token_secret,
});

var secretary = require('./secretary.js').secretary;

if(argv.run().targets.shift() === 'stop'){
  exec("kill -9 `ps aux | grep node | grep $PWD | awk '{print $2}'`", function(err, stdout, stderr){
    console.log("err="+err);
    console.log("stdout="+stdout);
    console.log("stderr="+stderr);
    setTimeout(function(){
      process.exit();
    },2000);
  });
}else{
  hisyotan.stream('user',function(stream){

    var is_debug = false;
    var first_message = '';

    if(argv.run().targets.shift() === 'debug'){
      is_debug = true;
      first_message = util.d() + ' 秘書たんはデバッグモードで起床しました!!';
    }else{
      first_message = util.d() + ' 秘書たんは起床しました!!';
    }

    hisyotan.updateStatus(first_message, function(res){
      console.log(first_message);
    });

    secretary.setMode('hisyotan');
    stream.on('data',function(data){
      if(!secretary.setEntry(data)){
        return 0;
      }
      if(data.retweeted_status && Boolean(data.retweeted_status.retweeted)){
        console.log(util.d() + '>>is retweeted');
        return 0;
      }
      secretary.main(is_debug);
    });
  });
}
