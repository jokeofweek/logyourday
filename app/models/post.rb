class Post
  include Mongoid::Document
  include Mongoid::Timestamps
  belongs_to :user

  field :message
  field :tags, type: Array


end
