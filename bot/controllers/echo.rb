require 'pp'

module BOT
  class EchoController < BaseController
    def initialize
      super Regexp.new("@hisyotan -e[ 　](?<value>.+)")
    end
    def handle(status)
      user = Models::User.where(:id_original => status.user.id).first
      return self.reply(status, "だれやねん") if user.nil?
      value = @pattern.match(status.text)["value"]
      self.reply(status, value)
    end
  end
end
