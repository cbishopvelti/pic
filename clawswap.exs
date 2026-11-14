# clawswap's settings for this repo. See https://cbishopvelti.github.io/clawswap/configuration.html
[
  base: "master",

  # The servers a switch stops and starts again, each in its own pane. BROWSER=none stops react-scripts
  # opening a tab on every switch, and PORT pins it so it doesn't ask to move when 3000 is taken.
  # The backend runs with `mix holo`, Phoenix with Hologram's compiler and runtime on.
  servers: [
    web: [command: "BROWSER=none PORT=3000 npm start", cwd: "frontend", port: 3000, match: ~r/npm start|react-scripts start/],
    api: [command: "mix holo", cwd: "backend", port: 4000, match: ~r/mix holo|phx\.server/]
  ],

  # Runs before `clawswap up` starts a new session.
  prepare: [
    [label: "npm install", run: "test -d node_modules || npm install", cwd: "frontend"],
    [label: "mix setup", run: "test -d deps || mix setup", cwd: "backend"]
  ],

  # What a switch runs when these files changed.
  steps: [
    [label: "npm install", when: ["frontend/package.json", "frontend/package-lock.json"], run: "npm install", cwd: "frontend"],
    [label: "mix deps.get", when: ["backend/mix.exs", "backend/mix.lock"], run: "mix deps.get", cwd: "backend"],
    [label: "Migrating", when: "backend/priv/repo/migrations/", run: "mix ecto.migrate", cwd: "backend"]
  ]
]
