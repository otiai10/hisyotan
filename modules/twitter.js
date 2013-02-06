/**
 * my module
 * twitter.js
**/

var conf = require('../conf_my.js').conf;

var OAuth = require('oauth').OAuth;
var oauth = new OAuth(
  conf.request_token,
  conf.access_token_app,
  conf.consumer_key,
  conf.consumer_secret,
  conf.oauth_version, // 1.0
  null,
  conf.encryption
);

exports.follow = function(params, callback){
//  console.log(
//    conf.friendships_create_api,
//    conf.access_token,
//    conf.access_token_secret,
//    {'screen_name' : params.screen_name }
//  );
  oauth.post(
    conf.friendships_create_api,
    conf.access_token,
    conf.access_token_secret,
    {'screen_name' : params.screen_name },
    function(err, data){
      callback(err, data);
    }   
  );  
};

exports.leave = function(params, callback){
//  console.log(
//    conf.friendships_destroy_api,
//    conf.access_token,
//    conf.access_token_secret,
//    {'screen_name' : params.screen_name }
//  );
  oauth.post(
    conf.friendships_destroy_api,
    conf.access_token,
    conf.access_token_secret,
    {'screen_name' : params.screen_name },
    function(err, data){
      callback(err,data);
    }
  );
};

// favる
exports.fav = function(id, callback){
  // dataで渡すんじゃなくて、叩くurlで渡すのがいいみたい
  var favorites_create_target = conf.favorites_create_api + id + '.json';
  try{
    oauth.post(
      favorites_create_target,
      conf.access_token,
      conf.access_token_secret,
      null,
      function(err, data){
        callback(err,data);
      }
    );
  }catch(e){
    callback(e,e);
  }
};
