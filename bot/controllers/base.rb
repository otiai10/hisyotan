module BOT
  class BaseController
    def initialize(pattern)
      @pattern = pattern
    end
    def match(status)
      return status.text =~ @pattern
    end
  end
end
