/**
 * node_twtterモジュールにフォローが無かったら自前使わなあかんやんけ、的なテスト
**/

var bot = new require('../modules/twitter');

console.log(bot);

var params = {
  'status' : 'hoge',
};

/******* [ok] tweet ****************
*/
bot.tweet(params,function(err,data){
  console.log('error=', err);
  console.log('data=', data);
});
/*
***********************************/

//exports.follow = function(params, callback){
//    oauth.post(
//      conf.friendships_create_api,
//      conf.access_token_bot,
//      conf.access_token_secret_bot,
//      {'screen_name': params.screen_name},
//      function(err, data){
//        callback(err, data);
//      }   
//    );
//};
