require 'pp'

class User
  include MongoMapper::Document

  set_collection_name 'users'

  many :task, :default => []

  key :id_original, Bignum
  key :id_str,      String
  key :name,        String
  key :screen_name, String

  def self.from_twitter_response(user)
    return User.new(:id_original => user.id,
    :id_str      => user.id.to_s,
    :name        => user.name,
    :screen_name => user.screen_name)
  end

end
