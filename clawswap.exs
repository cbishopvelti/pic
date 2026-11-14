# clawswap's settings for this repo. See https://cbishopvelti.github.io/clawswap/configuration.html
[
  base: "master",

  # The servers a switch stops and starts again, each in its own pane. BROWSER=none stops react-scripts
  # opening a tab on every switch, and PORT pins it so it doesn't ask to move when 3000 is taken.
  servers: [
    web: [command: "BROWSER=none PORT=3000 npm start", cwd: ".", port: 3000, match: ~r/npm start|react-scripts start/]
  ],

  # Runs before `clawswap up` starts a new session.
  prepare: [
    [label: "npm install", run: "test -d node_modules || npm install"]
  ],

  # What a switch runs when these files changed.
  steps: [
    [label: "npm install", when: ["package.json", "package-lock.json"], run: "npm install"]
  ]
]
