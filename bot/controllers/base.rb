module BOT
  class BaseController
    attr_accessor :api
    def initialize(pattern)
      @pattern = pattern
    end
    def match(status)
      return status.text =~ @pattern
    end

    protected
    def reply(status, msg, add_prefix=true)
      msg = "@#{status.user.screen_name} #{msg}"
      msg += "\n#{Time.new.strftime('%H:%M')}" if add_prefix
      return @api.update(msg, in_reply_to_status_id: status.id)
    end
  end
end
