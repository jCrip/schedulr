Rails.application.routes.draw do

  resources :events
  root 'pages#index'

end
