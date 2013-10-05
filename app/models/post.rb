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


end
