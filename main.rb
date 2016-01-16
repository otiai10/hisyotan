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

MongoMapper.connection = Mongo::Connection.new('localhost', 27017)
MongoMapper.database = 'hisyotan-dev'

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

begin
  router = BOT::Router.new(stream, api)
  router.reject(lambda{|status| status.user.screen_name == "hisyotan"})
  router.reject(lambda{|status| status.retweeted_status? })
  router.add(BOT::RememberMeController.new)
  router.add(BOT::GoodbyeController.new)
  router.add(BOT::EchoController.new)
  router.add(BOT::AddController.new)
  router.add(BOT::ListController.new)
  router.add(BOT::DoneController.new)
  router.add(BOT::TimerController.new)
  router.add(BOT::VersionController.new)

  api.update("秘書たん起動！ #{Time.new.strftime('%H:%M:%S')}")

  router.listen("userstream")

rescue Interrupt => e
  api.update("秘書たんはおやすみします #{Time.new.strftime('%H:%M:%S')}")
rescue Exception => e
  begin
    api.update("秘書たん起動しっぱい！ `#{e.to_s}` #{Time.new.strftime('%H:%M:%S')}")
  rescue Exception => e
    p "[ERROR] #{e.to_s}"
  end
end
