class Post
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :message

  field :metrics, type: Array,default: []

  field :tags, type: Hash, default: {}

  field :units, type: Array,default: []

  validates_presence_of :user

  before_create :process_tags



  #returns posts on the given page
  def self.page(page,limit)
    page ||= 0
    limit ||= 25
    order_by(:created_at.desc).skip(page.to_i*limit.to_i).limit(limit.to_i)
  end 

  #returns posts with the given tag
  def self.find_with_tag tag
    exists("tags.#{tag}" => true)
  end

  # returns metrics of a post that contain the given unit
  def metric_with_unit(unit)
    metrics.select {|m| Unit.new(m) <=> Unit.new(unit)}
  end

  private

  def process_tags
    unit_hash = Hash[units.map {|e| [e,true]}]
    user.units |= units
    user.tags.merge! tags
    user.save
    tags.merge! unit_hash
  end
end
