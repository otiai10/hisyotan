require 'pp'

module BOT
  class GoodbyeController < BaseController
    def initialize
      super Regexp.new("@hisyotan -goodbye[ 　]*")
    end
    def handle(status, api)
      user = Models::User.where(:id_original => status.user.id).first
      if user.nil?
        self.reply(status, "誰すか？")
      else
        user.delete
        self.reply(status, "さよならはさみしいです...")
      end
    end
  end
end
