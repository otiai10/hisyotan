module BOT
  def self.message(key, **args)
    m = Messages.get[key]
    return args.to_s if m.nil?
    begin
      return sprintf m[rand(m.length)], args
    rescue => e
      return args.to_s
    end
  end
  class Messages
    def self.get
      Messages.prepare if @@messages.nil?
      return @@messages
    end
    private
    def self.prepare
      @@messages = YAML.load_file(File.dirname(__FILE__) + '/messages.yml')
    end
    @@messages = nil
  end
end
