defmodule Pic.MixProject do
  use Mix.Project

  def project do
    [
      app: :pic,
      version: "0.1.0",
      # Hologram needs Elixir 1.19.
      elixir: "~> 1.19",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      compilers: Mix.compilers() ++ [:hologram],
      listeners: [Phoenix.CodeReloader]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Pic.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  def cli do
    [
      preferred_envs: [precommit: :test]
    ]
  end

  # Specifies which paths to compile per environment.
  # app/ holds the Hologram pages, layouts and components.
  defp elixirc_paths(:test), do: ["app", "lib", "test/support"]
  defp elixirc_paths(_), do: ["app", "lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.8.16"},
      {:phoenix_ecto, "~> 4.5"},
      # Phoenix encodes HTML error pages (PicWeb.ErrorHTML) with it.
      {:phoenix_html, "~> 4.1"},
      {:ecto_sql, "~> 3.13"},
      # bdb (github.com/cbishopvelti/bdb) speaks the Postgres wire protocol, so Ecto uses Postgrex.
      {:postgrex, ">= 0.0.0"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:telemetry_metrics, "~> 1.0"},
      {:telemetry_poller, "~> 1.0"},
      {:jason, "~> 1.2"},
      {:bandit, "~> 1.5"},
      {:hologram, "~> 0.12"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      # bdb has no CREATE DATABASE or DROP DATABASE: a bdb server is one database, so there is no
      # ecto.create / ecto.drop step. Reset by stopping the server and clearing its data dir.
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.migrate", "run priv/repo/seeds.exs"],
      test: ["ecto.migrate --quiet", "test"],
      precommit: ["compile --warnings-as-errors", "deps.unlock --unused", "format", "test"]
    ]
  end
end
