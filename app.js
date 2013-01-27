/**
 * app.js
**/
//-----[const]-----
var PROJ_ROOT = '/home/hiromu/node/projects/hisyotan';
var SRC_PATH  = PROJ_ROOT + '/src';
//-----------------

var util = require('./modules/util.js').util,
    conf = require('./conf_my.js').conf,
 twitter = require('twitter');

var hisyotan = new twitter({
  consumer_key        : conf.consumer_key,
  consumer_secret     : conf.consumer_secret,
  access_token_key    : conf.access_token,
  access_token_secret : conf.access_token_secret,
});

var secretary = require('./secretary.js').secretary;

hisyotan.stream('user',function(stream){
  console.log(util.d() + 'WAKE UP');

  secretary.setMode('hisyotan');

  stream.on('data',function(data){
    console.log('----------------------');
    console.log(data);
    if(!secretary.setEntry(data)){
      return 0;
    }
    secretary.main();
  });
});