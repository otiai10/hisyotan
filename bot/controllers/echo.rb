require 'pp'

module BOT
  class EchoController < BaseController
    def initialize
      super Regexp.new("@hisyotan -e[ 　](?<value>.+)")
    end
    def handle(status, api)
      user = Models::User.where(:id_original => status.user.id).first
      if user.nil?
        self.reply(status, "だれやねん")
      else
        value = @pattern.match(status.text)["value"]
        self.reply(status, value)
      end
    end
  end
end
