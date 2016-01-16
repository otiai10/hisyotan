module BOT
  class TimerController < BaseController
    def initialize
      super Regexp.new("@hisyotan -timer[ 　](?<hour>(off|[0-9]{0,2}))")
    end
    def handle(status)
      user = User.where(:id_original => status.user.id).first
      return self.reply(status, "だれやねん") if user.nil?

      hour = @pattern.match(status.text)["hour"]
      if hour == "off"
        p user.unset(:timer)
        return self.reply(status, "タイマーをオフにした")
      end
      user.set(:timer => hour.to_i)
      self.reply(status, "タイマーを#{hour.to_i}時にセットしました")
    end
  end
end
