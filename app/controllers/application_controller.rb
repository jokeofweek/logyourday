class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?
  def current_user
    if session[:current_user_id]
      @current_user ||= User.find(session[:current_user_id])
    end
    User.first
  end
  def logged_in?
    current_user.present?
  end
  def authorize
    if not logged_in?
      redirect_to "/login"
    end
  end
end
