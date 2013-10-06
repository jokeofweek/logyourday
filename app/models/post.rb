class Post
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::TagsArentHard
  belongs_to :user

  field :message
  taggable_with :tags

  taggable_with :units

  field :metrics, type: Array,default: []

  def metric_with_unit(unit)
    metrics.select {|m| m.include? unit}
  end
end
