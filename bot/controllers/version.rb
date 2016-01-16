module BOT
  class VersionController < BaseController
    def initialize
      super Regexp.new("@hisyotan (-v|バージョン).*")
    end
    def handle(status)
      p self.reply(status, "0.0.2")
    end
  end
end
