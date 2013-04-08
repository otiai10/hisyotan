var util = require('../modules/util').util,
    conf = require('../conf_my').conf,
    argv = require('argv'),
 twitter = require('twitter');

var hisyotan = new twitter({
  consumer_key        : conf.consumer_key,
  consumer_secret     : conf.consumer_secret,
  access_token_key    : conf.access_token,
  access_token_secret : conf.access_token_secret,
});

hisyotan.updateStatus('@otiai10 ' + util.d() + ' ...　ちょっと疲れたんで寝ますねぇ....ふわぁぁ...', function(res){
  setTimeout(function(){
    process.exit();
  }, 3000);
});
