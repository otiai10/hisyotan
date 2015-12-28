require 'pp'
require 'twitter'
require 'tweetstream'
require 'yaml'

require './app/router'
Dir['./app/controllers/*.rb'].each do |file|
  require file
end

conf = YAML.load_file('config.yml')

TweetStream.configure do |config|
  config.consumer_key       = conf["twitter"]["consumer"]["key"]
  config.consumer_secret    = conf["twitter"]["consumer"]["secret"]
  config.oauth_token        = conf["twitter"]["account"]["token"]
  config.oauth_token_secret = conf["twitter"]["account"]["token_secret"]
  config.auth_method        = :oauth
end
stream = TweetStream::Client.new

api = Twitter::REST::Client.new do |config|
  config.consumer_key        = conf["twitter"]["consumer"]["key"]
  config.consumer_secret     = conf["twitter"]["consumer"]["secret"]
  config.access_token        = conf["twitter"]["account"]["token"]
  config.access_token_secret = conf["twitter"]["account"]["token_secret"]
end

router = Router.new(stream, api)
router.reject(lambda{|status| status.user.screen_name == "hisyotan"})
router.reject(lambda{|status| status.retweeted_status? })
router.add(EchoController.new)
router.listen("userstream")
