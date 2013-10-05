class UsersController < ApplicationController
  before_filter :authorize, except: [:current]

  def current
    if logged_in?
        render text: current_user.id
    else 
        render nothing: true
    end
  end
end
