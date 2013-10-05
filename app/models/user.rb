class User
  include Mongoid::Document

  field :provider
  field :token
  field :secret
  field :expired_at

  def self.find_or_create_by_auth(auth_hash)
    @user = User.where(identifier: auth_hash["username"], provider: auth_hash["provider"]).first

    if @user.nil?
      @user = User.new
      @user.provider = auth_hash["provider"]
      @user.token = auth_hash.credentials["token"]
      @user.expired_at = auth_hash.credentials["expires_at"]
      @user.username = auth_hash["username"]
      @user.save
    end
    @user
  end
end
