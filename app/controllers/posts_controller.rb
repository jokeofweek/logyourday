class PostsController < ApplicationController
  before_filter :authorize

  def index
    @posts = current_user.posts.page(params[:page],params[:limit])
    @tags = getTags(params[:message])
    puts params[:message]
    puts Post.getVerb(params[:message])
    puts @tags
    puts @amount
  end

  def show 
    @post = Post.find(params[:id])
  end

  def new 
    @post = Post.new 
  end

  def create
    tags = getTags(params[:message])
    

#    if @post.save
#      redirect_to user_posts current_user
#    else
#      redirect_to :root
#    end
  end


  def getTags(message)
    tokens = message.split(" ")
    tokens.shift if /^[Ii]$/.match(tokens[0])
    tags = []
    tokens.each do |token|
      tags.push(token) if /#+\w+/.match(token)
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
