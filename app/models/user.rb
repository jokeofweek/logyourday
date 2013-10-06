class User
  include Mongoid::Document

  field :provider
  field :token
  field :secret
  field :expired_at
  field :identifier
  has_many :posts do
    def page(page,limit)
      page ||= 0
      limit ||= 25
    order_by(:created_at.desc).skip(page.to_i*limit.to_i).limit(limit.to_i)
  end 
end

def self.find_or_create_by_auth(auth_hash)
  @user = User.where(identifier: auth_hash["uid"], provider: auth_hash["provider"]).first

  if @user.nil?
    @user = User.new
    @user.provider = auth_hash["provider"]
    @user.token = auth_hash.credentials["token"]
    @user.expired_at = auth_hash.credentials["expires_at"]
    @user.identifier = auth_hash["uid"]
    @user.save
  end
  @user
end
end
