/**
 * test driver
**/


function testStreamOn(data){//twitter.stream.on('data'みたいな
  var secretary = new require('../secretary.js').secretary;
  secretary.setMode('hisyotan');
  if(!secretary.setEntry(data)){
    console.log('Cannot setEntry');
    process.exit();
  }
  var is_debug = true;
  secretary.main(is_debug);
}

// サンプルデータ
var sample = {
  created_at: 'Wed Jan 09 11:37:45 +0000 2013',
  id: 288972828353646600,
  id_str: '288972828353646592',
  // ########## とりあえず ##########
  //text: '@hisyotan とりあえずドライバーつくりたいから返事してくr',
  // ########## タスク管理 ##########
  //text: '@hisyotan /& smpl01 smpl02 smpl03',
  //text: '@hisyotan --done smpl01 smpl02 smpl03 smpl04',
  // ########## トリガーワード ##########
  //text: 'ほげほげおやすみなさい',
  // ########## デイリーリマインド ##########
  //text: '@hisyotan --daily-up どちらかというと早寝早起き とかとか',
  //text: '@hisyotan --daily-on 07:00',
  //text: '@hisyotan --daily-off',
  // ########## 契約／解除 ##########
  //text: '@hisyotan --init よろしくね',
  //text: '@hisyotan --bye きみとはやってられん',
  // ########## PDFのリマインド ##########
  //text: '@hisyotan --pdf-on',
  //text: '@hisyotan --pdf-off',
  text: '@hisyotan --pdf-dbg',
  source: '<a href="http://itunes.apple.com/us/app/twitter/id409789998?mt=12" rel="nofollow">Twitter for Mac</a>',
  truncated: false,
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: 971441053,
  in_reply_to_user_id_str: '971441053',
  in_reply_to_screen_name: 'hisyotan',
  user: 
   { id: 140021552,
     id_str: '140021552',
     name: 'おちあいさん@がんばれない',
     screen_name: 'otiai10',
     location: 'JavaScript、Node.js、PHP',
     url: 'http://otiai10.com',
     description: 'もうがんばれません',
     protected: false,
     followers_count: 486,
     friends_count: 466,
     listed_count: 28,
     created_at: 'Tue May 04 10:10:16 +0000 2010',
     favourites_count: 709,
     utc_offset: 32400,
     time_zone: 'Tokyo',
     geo_enabled: true,
     verified: false,
     statuses_count: 30487,
     lang: 'ja',
     contributors_enabled: false,
     is_translator: false,
     profile_background_color: 'D5D9E0',
     profile_background_image_url: 'http://a0.twimg.com/profile_background_images/441118100/432310_265475653528100_100001970017856_589138_1201261039_n.jpg',
     profile_background_image_url_https: 'https://si0.twimg.com/profile_background_images/441118100/432310_265475653528100_100001970017856_589138_1201261039_n.jpg',
     profile_background_tile: false,
     profile_image_url: 'http://a0.twimg.com/profile_images/3026052168/1ed43fa397712533a59147db5b6f331b_normal.jpeg',
     profile_image_url_https: 'https://si0.twimg.com/profile_images/3026052168/1ed43fa397712533a59147db5b6f331b_normal.jpeg',
     profile_link_color: '022469',
     profile_sidebar_border_color: 'FFFFFF',
     profile_sidebar_fill_color: '7D7D7D',
     profile_text_color: '051C4A',
     profile_use_background_image: false,
     default_profile: false,
     default_profile_image: false,
     following: null,
     follow_request_sent: null,
     notifications: null },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  retweet_count: 0,
  entities: { hashtags: [], urls: [], user_mentions: [ [Object] ] },
  favorited: false,
  retweeted: false,
  lang: 'ja'
};


testStreamOn(sample);
