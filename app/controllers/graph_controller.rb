class GraphController < ApplicationController
  before_filter :authorize
  def index
    if params[:tag].present?
      @tag = URI.decode(params[:tag])
    else
      @tag = ''
    end 
  end
end
