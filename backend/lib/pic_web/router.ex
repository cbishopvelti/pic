defmodule PicWeb.Router do
  use PicWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {PicWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

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
