require 'pp'

module BOT
  class RememberMeController < BaseController
    def initialize
      super Regexp.new("@hisyotan -rememberme[ 　]*")
    end
    def handle(status, api)
      user = Models::User.where(:id_original => status.user.id).first
      if user.nil?
        user = Models::User.from_twitter_response(status.user)
        user.save! # TODO: use `upsert`
        self.reply(status, "よろしくお願いしまーす！")
      else
        self.reply(status, "#{user.screen_name}さん、ですよね？")
      end
    end
  end
end
