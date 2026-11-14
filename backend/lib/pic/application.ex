defmodule Pic.Application do
  # See https://elixir.hexdocs.pm/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      PicWeb.Telemetry,
      Pic.Repo,
      {Ecto.Migrator,
       repos: Application.fetch_env!(:pic, :ecto_repos), skip: skip_migrations?()},
      {DNSCluster, query: Application.get_env(:pic, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Pic.PubSub},
      # Start a worker by calling: Pic.Worker.start_link(arg)
      # {Pic.Worker, arg},
      # Start to serve requests, typically the last entry
      PicWeb.Endpoint
    ]

    # See https://elixir.hexdocs.pm/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Pic.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PicWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp skip_migrations?() do
    # Migrations run at boot in a release; in dev and test, mix ecto.migrate does it.
    System.get_env("RELEASE_NAME") == nil
  end
end
