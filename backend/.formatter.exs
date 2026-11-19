[
  import_deps: [:ecto, :ecto_sql, :phoenix, :hologram],
  subdirectories: ["priv/*/migrations"],
  inputs: ["*.{ex,exs}", "{app,config,lib,test}/**/*.{ex,exs}", "priv/*/seeds.exs"]
]
