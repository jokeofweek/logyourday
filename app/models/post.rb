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
  def self.with_tag(tag)
    exists("tags.#{tag}" => true)
  end

  # returns metrics of a post that contain the given unit
  def metric_with_unit(unit)
    metrics.select {|m| Unit.new(m) <=> Unit.new(unit)}
  end

  def self.getVerb(message)
    url = URI.parse('http://access.alchemyapi.com/calls/text/TextGetRelations?apikey=' + ENV['ALCHEMY_API_KEY'])
    req = Net::HTTP::Post.new(url)
    req.set_form_data('text' => URI.escape('Jim ' + message.gsub(/[\.!?]/,' ')), 'outputMode' => 'json')
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
    tags.merge! unit_hash || {}
    user.tags.merge! tags || {}
    user.save
  end
end

# Dirty
module Net
    module HTTPHeader
        def postUrlBuilder(postParams)
            @queryUrl = ''
            if (postParams.nil? or postParams == 0)
                # Null or empty item
            else
                count = 0
                postParams.each_pair do |key,value|
                    if (count == 0)
                        @queryUrl = @queryUrl + key + '=' + value
                        count = count + 1
                    else 
                        @queryUrl = @queryUrl + '&' + key + '=' + value
                    end
                end
            end
            return @queryUrl
        end
        def set_form_data(postParams, sep = '&')
            self.body = postUrlBuilder(postParams)
            self.content_type = 'application/x-www-form-urlencoded'
        end
        alias form_data= set_form_data
   end
end
