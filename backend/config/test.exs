import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :pic, Pic.Repo,
  # A second bdb server, so tests never touch dev data: the same command as in dev.exs, on 5434.
  url: System.get_env("TEST_DATABASE_URL", "ecto://postgres:postgres@localhost:5434/pic"),
  pool_size: 5,
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :pic, PicWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "YbA+fiNOJH2pguBnH3efm5FoTBBM4WlY311lNkS7MVTtOLjS4T93xqeDmXGXC8Nk",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Enable helpful, but potentially expensive runtime checks
config :phoenix_live_view,
  enable_expensive_runtime_checks: true

# Sort query params output of verified routes for robust url comparisons
config :phoenix,
  sort_verified_routes_query_params: true
