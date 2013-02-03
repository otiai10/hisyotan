/**
 *  twitterの設定部分を閉じ込める
**/

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

exports.tweet = function(text, params, cb){
  bot.updateStatus(text, params, cb);
}
