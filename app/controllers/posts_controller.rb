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
    @post = Post.new(params[:post])

    if @post.save
      redirect_to posts_path  
    else
      redirect_to :root
    end
  end

  def tag
   @posts = Post.with_all_tags(params[:tag]).page(params[:page],params[:limit])
  end
end
