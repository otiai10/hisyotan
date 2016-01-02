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
        # TODO: use `upsert`
        user.save!
        api.update("@#{user.screen_name} よろしくお願いしまーす, #{user.screen_name}", in_reply_to_status_id: status.id)
      else
        api.update("@#{user.screen_name} #{user.screen_name}さん、ですよね？", in_reply_to_status_id: status.id)
      end
    end
  end
end
