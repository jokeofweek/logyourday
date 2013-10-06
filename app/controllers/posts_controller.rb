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
    @post = Post.new
    message = params[:message]
    @post.message = message
    @post.user = current_user
    verb_tag = Post.getVerb(message)
    tags = getTags(message)
    tags = tags.merge(verb_tag) unless verb_tag.nil?
    if tags.nil?
      redirect_to :root 
    else
      @post.tags = tags
      @post.metrics = getAmount(message)
      @post.units = []
      @post.metrics.each do |metric|
        @post.units.push(/[A-Za-z]+/.match(metric)[0])
      end

      @post.save
      redirect_to @post
    
    end
  end


  def getTags(message)
    tokens = message.split(" ")
    tokens.shift if /^[Ii]$/.match(tokens[0])
    tags = {}
    tokens.each do |token|
      tags[token] = token if /#+\w+/.match(token)
    end
    tags
  end

  def getAmount(message)
    message.scan(/\d+ *\w*/)
  end

  def tag
   @posts = Post.with_all_tags(params[:tag]).page(params[:page],params[:limit])
  end
end
