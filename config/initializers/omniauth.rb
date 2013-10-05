Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, ENV['LYD_FB_KEY'], ENV['LYD_FB_SECRET'], :scope => ''
  provider :twitter, ENV['LYD_TW_KEY'], ENV['LYD_TW_SECRET']
end
