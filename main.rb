require 'rubygems'
require 'bundler'
Bundler.require

require 'pp'

require 'yaml'

require './bot/controllers/base.rb'
Dir['./bot/**/*.rb'].each do |file|
  load file
end

conf = YAML.load_file('config.yml')

# {{{ TODO: use config
MongoMapper.connection = Mongo::Connection.new('localhost', 27017)
MongoMapper.database = 'hisyotan-dev'
# }}}

stream = TweetStream::Client.new({
  consumer_key:       conf["twitter"]["consumer"]["key"],
  consumer_secret:    conf["twitter"]["consumer"]["secret"],
  oauth_token:        conf["twitter"]["account"]["token"],
  oauth_token_secret: conf["twitter"]["account"]["token_secret"],
  auth_method:        :oauth
})

api = Twitter::REST::Client.new do |config|
  config.consumer_key        = conf["twitter"]["consumer"]["key"]
  config.consumer_secret     = conf["twitter"]["consumer"]["secret"]
  config.access_token        = conf["twitter"]["account"]["token"]
  config.access_token_secret = conf["twitter"]["account"]["token_secret"]
end

router = BOT::Router.new(stream, api)
router.reject(lambda{|status| status.user.screen_name == "hisyotan"})
router.reject(lambda{|status| status.retweeted_status? })
router.add(BOT::RememberMeController.new)
router.add(BOT::GoodbyeController.new)
router.add(BOT::EchoController.new)
router.add(BOT::AddController.new)
router.add(BOT::ListController.new)
router.add(BOT::DoneController.new)
router.listen("userstream")
