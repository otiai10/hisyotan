module Models
  class Task
    include MongoMapper::Document

    set_collection_name 'tasks'

    belongs_to :user

    key :user_id, Bignum
    key :title,   String

  end

end
