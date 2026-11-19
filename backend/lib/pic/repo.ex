defmodule Pic.Repo do
  use Ecto.Repo,
    otp_app: :pic,
    adapter: Ecto.Adapters.Postgres
end
