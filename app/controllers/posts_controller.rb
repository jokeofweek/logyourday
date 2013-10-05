class PostsController < ApplicationController
 # before_filter :authorize

  def index
    @posts = current_user.posts.page(params[:page].to_i,params[:limit].to_i)
  end

  def show 
    @post = Post.find(params[:id])
  end

  def new 
    @post = Post.new 
  end

  def create
    @post = Post.new(params[:post])

    if @post.save
      redirect_to user_posts current_user
    else
      redirect_to :root
    end
  end
end
