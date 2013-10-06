require 'net/http'

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
    skip(page.to_i*limit.to_i).limit(limit.to_i).desc(:created_at)
  end 

  #returns posts with the given tag
  def self.find_with_tag tag
    exists("tags.#{tag}" => true)
  end

  # returns metrics of a post that contain the given unit
  def metric_with_unit(unit)
    metrics.select {|m| Unit.new(m) <=> Unit.new(unit)}
  end

  def self.getVerb(message)
    url = URI.parse('http://access.alchemyapi.com/calls/text/TextGetRelations?apikey=' + ENV['ALCHEMY_API_KEY'])
    req = Net::HTTP::Post.new(url)
    req.set_form_data('text' => 'Denis ' + message, 'outputMode' => 'json')
    req['Content-type'] = "application/x-www-form-urlencoded"
    req['Accept-Encoding'] = 'identity'
    res = Net::HTTP.start(url.hostname, url.port) do |http|
      http.request(req)
    end
    response = JSON.parse(res.body)
    if response['relations'].present?
      normal = response['relations'][0]['action']['lemmatized']
      actual = response['relations'][0]['action']['text']
      { normal => actual }
    else
      nil
    end
  end

  private

  def process_tags
    unit_hash = Hash[units.map {|e| [e,e]}]
    user.units |= units
    user.tags.merge! tags || {}
    user.save
    tags.merge! unit_hash || {}
  end
end
