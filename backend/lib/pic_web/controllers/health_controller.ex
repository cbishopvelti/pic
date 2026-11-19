defmodule PicWeb.HealthController do
  use PicWeb, :controller

  # GET /api/health: the server is up and can reach the database.
  def show(conn, _params) do
    Ecto.Adapters.SQL.query!(Pic.Repo, "SELECT 1")
    json(conn, %{status: "ok"})
  end
end
