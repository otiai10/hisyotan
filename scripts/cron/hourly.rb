require 'rubygems'
require 'bundler'
Bundler.require

require 'yaml'

require './bot/models/task.rb'
require './bot/models/user.rb'

require './bot/messages/messages.rb'

MongoMapper.connection = Mongo::Connection.new('localhost', 27017)
MongoMapper.database = 'hisyotan-dev'

conf = YAML.load_file('config.yml')
api = Twitter::REST::Client.new do |config|
  config.consumer_key        = conf["twitter"]["consumer"]["key"]
  config.consumer_secret     = conf["twitter"]["consumer"]["secret"]
  config.access_token        = conf["twitter"]["account"]["token"]
  config.access_token_secret = conf["twitter"]["account"]["token_secret"]
end

users = User.where(:timer => Time.new.hour).all

users.each do |user|
  tasks = Task.where(:user_id => user.id_original).all
  if !tasks.nil? && tasks.length > 0
    titles = tasks.map do |task|
      task.title
    end
    api.update("@#{user.screen_name} #{titles}", in_reply_to_screen_name: user.screen_name)
  else
    api.update("@#{user.screen_name} #{BOT.message('hello')}", in_reply_to_screen_name: user.screen_name)
  end
end
