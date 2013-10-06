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
      @post.metrics = getMetrics(message)
      @post.units = []
      @post.metrics.each do |metric|
        # Add the unit name.
        @post.units.push(metric[1])
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

  def getMetrics(message)
    message.scan(/(\d+)\s*(\w*)/)
  end

  def tag
    puts(params[:tag])
    tags = params[:tag].split(',')
    @posts = Post
    tags.each do |tag|
      @posts = @posts.with_tag(URI.unescape(tag))
    end
    @posts = @posts.page(params[:page],params[:limit])
  end
end
