require 'forwardable'

module BOT
  class Router
    extend Forwardable

    attr_accessor :controllers

    def initialize(stream, api)
      @stream = stream
      @api = api
      @controllers = Array.new
      @rejectors = Array.new
    end

    def reject(rejector)
      @rejectors.push rejector
    end


    def add(controller)
      @controllers.push controller
    end

    def listen(methodname)
      @stream.send(methodname) do |status|
        if rejects(status)
          next
        end
        let_handle(status)
      end
    end

    private

    def rejects(status)
      @rejectors.each do |rejector|
        if rejector.call(status)
          return true
        end
      end
      return false
    end

    def let_handle(status)
      @controllers.each do |controller|
        if controller.match status
          controller.api = @api
          controller.handle(status, @api)
          next
        end
      end
    end

  end
end
