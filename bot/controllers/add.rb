module BOT
  class AddController < BaseController
    def initialize
      super Regexp.new("@hisyotan -a[ 　](?<values>.+)")
    end
    def handle(status)
      user = Models::User.where(:id_original => status.user.id).first
      return self.reply(status, "だれやねん") if user.nil?

      values = @pattern.match(status.text)["values"].split(Regexp.new("[ 　]+"))
      values.each do |value|
        # TODO: duplication check
        Models::Task.new(:user_id => status.user.id, :title => value).save
      end
      self.reply(status, values.to_s)
    end
  end
end
