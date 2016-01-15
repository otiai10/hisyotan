require 'pp'

module BOT
  class GoodbyeController < BaseController
    def initialize
      super Regexp.new("@hisyotan -goodbye[ 　]*")
    end
    def handle(status)
      user = User.where(:id_original => status.user.id).first
      return self.reply(status, "誰すか？") if user.nil?
      user.delete
      self.reply(status, "さよならはさみしいです...")
    end
  end
end
