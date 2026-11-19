defmodule PicWeb.Router do
  use PicWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  # The pages are Hologram's (app/pages), served by Hologram.Router in the endpoint before this router.

  # The JSON API the React frontend will call.
  scope "/api", PicWeb do
    pipe_through :api

    get "/health", HealthController, :show
  end
end
