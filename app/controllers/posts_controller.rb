class PostsController < ApplicationController
  before_filter :authorize

  def index
    @posts = current_user.posts.page(params[:page],params[:limit])
  end

  def show 
    @post = Post.find(params[:id])
  end

  def new 
    @post = Post.new 
  end

  def create
    tags = getTags(params[:message])
    @post = current_user.posts.new(tags: tags, message: params[:message])
    if @post.save
      redirect_to user_posts current_user
    else
      redirect_to :root
    end
  end

  def getTags(message)
    tokens = message.split(" ")
    tokens.shift if /^[Ii]$/.match(tokens[0])
    action = ""
    tokens.each do |token|
      if /^(for|to|in|at|on)$/.match(token) || /\d/.match(token)
        break
      end
      action += token
    end
    tags = [action]
    tokens.each do |token|
      tags.push(token) if /#+\w+/.match(token)
    end
    tags
  end

  def getAmount(message)
    message.scan(/\d+ *\w*/)
  end

  def tag
   @posts = Post.find_with_tag(params[:tag]).page(params[:page],params[:limit])
  end
end
