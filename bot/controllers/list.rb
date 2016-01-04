require 'pp'

module BOT
  class ListController < BaseController
    def initialize
      super Regexp.new("@hisyotan -l.*")
    end
    def handle(status)
      tasks = Models::Task.where(:user_id => status.user.id).all
      return self.reply(status, "そんなもんない") if tasks.empty?
      titles = tasks.map do |task|
        task.title
      end
      self.reply(status, titles.to_s)
    end
  end
end
