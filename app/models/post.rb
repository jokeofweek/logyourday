class Post
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::TagsArentHard
  belongs_to :user

  field :message
  taggable_with :tags

end
