class UsersController < ApplicationController
  before_filter :authorize, except: [:current]

  def current
    if logged_in?
        render text: current_user.id
    else 
        render nothing: true
    end
  end

  def tags
    @tags = current_user.tags.keys
  end

  def units
    @units = current_user.units.keys
  end
end
