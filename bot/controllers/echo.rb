require 'pp'

module BOT
  class EchoController < BaseController
    def initialize
      super Regexp.new("@hisyotan -e[ 　](?<value>.+)")
    end
    def handle(status)
      user = User.where(:id_original => status.user.id).first
      return self.reply(status, "だれやねん") if user.nil?
      value = @pattern.match(status.text)["value"]
      self.reply(status, BOT.message("echo", v: value))
    end
  end
end
