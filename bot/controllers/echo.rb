require 'pp'

module BOT
  class EchoController < BaseController
    def initialize
      super Regexp.new("@hisyotan -e[ 　](?<value>.+)")
    end
    def handle(status, api)
      user = Models::User.where(:id_original => status.user.id).first
      if user.nil?
        api.update("@#{status.user.screen_name} だれやねん", in_reply_to_status_id: status.id)
      else
        value = @pattern.match(status.text)["value"]
        api.update("@#{status.user.screen_name} #{value}", in_reply_to_status_id: status.id)
      end
    end
  end
end
