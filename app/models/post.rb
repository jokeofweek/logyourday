class Post
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :message

  field :metrics, type: Array,default: []

  field :tags, type: Hash

end
