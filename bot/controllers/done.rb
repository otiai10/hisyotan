module BOT
  class DoneController < BaseController
    def initialize
      super Regexp.new("@hisyotan -d[ 　](?<values>.+)")
    end
    def handle(status)
      values = @pattern.match(status.text)["values"].split(Regexp.new("[ 　]+"))
      values.each do |value|
        task = Models::Task.where(:user_id => status.user.id, :title => value).first
        task.delete unless task.nil?
      end
      self.reply(status, "Done: #{values.to_s}")
    end
  end
end
