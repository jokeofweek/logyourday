require 'net/http'

class Post
  include Mongoid::Document
  include Mongoid::Timestamps
  belongs_to :user do
  def page(page=0,limit=25)
    skip(page*limit).limit(limit)
  end 
  end

  field :message
  field :tags, type: Array

  def self.getVerb(message)
    url = URI.parse('http://access.alchemyapi.com/calls/text/TextGetRelations?apikey=' + ENV['ALCHEMY_API_KEY'])
    message = URI.escape(message)
    puts message
    req = Net::HTTP::Post.new(url)
    req.set_form_data('text' => message, 'outputMode' => 'json')
    req['Content-type'] = "application/x-www-form-urlencoded"
    req['Accept-Encoding'] = 'identity'
    res = Net::HTTP.start(url.hostname, url.port) do |http|
      http.request(req)
    end
    response = JSON.parse(res.body)
    puts(response)
    normal = response['relations']['action']['lemmatized']
    actual = response['relations']['action']['text']
    { normal => actual }
  end
end
