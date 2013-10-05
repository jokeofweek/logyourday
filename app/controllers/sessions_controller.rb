class SessionsController < ApplicationController
  def create
    unless logged_in?
      @user = User.find_or_create_by_auth(auth_hash)
      session[:current_user_id] = @user.id
    end
    redirect_to :root
  end

  def destroy
  end
end
