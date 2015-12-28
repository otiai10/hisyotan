
module BOT
  class BaseController
    def initialize(pattern)
      @pattern = pattern
    end
  end

  class EchoController < BaseController
    def initialize
      super Regexp.new("@hisyotan -e[ 　]")
    end
    def match(status)
      return status.text =~ @pattern
    end
    def handle(status, api)
      api.update("@#{status.user.screen_name} #{status.text} エコー", in_reply_to_status_id: status.id)
    end
  end
end
