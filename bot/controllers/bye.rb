require 'pp'

module BOT
  class GoodbyeController < BaseController
    def initialize
      super Regexp.new("@hisyotan -goodbye[ 　]*")
    end
    def handle(status, api)
      user = Models::User.where(:id_original => status.user.id).first
      if user.nil?
        api.update("@#{status.user.screen_name} 誰すか？", in_reply_to_status_id: status.id)
      else
        api.update("@#{user.screen_name} さよならはさみしいです...", in_reply_to_status_id: status.id)
        user.delete
      end
    end
  end
end
