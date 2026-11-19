# pic backend

A Phoenix 1.8 app with [Hologram](https://hologram.page) for pages, on [bdb](https://github.com/cbishopvelti/bdb)
through Ecto's Postgres adapter.

- `app/`: Hologram pages and layouts. `/` is a placeholder page.
- `lib/pic_web/router.ex`: the JSON API under `/api`, for the React frontend. So far there is only
  `GET /api/health`, which also checks the database.
- There is no LiveView, and no asset pipeline: Hologram bundles its own page JavaScript.

```sh
mix setup       # deps.get, then migrate and seed
mix holo        # the server on http://localhost:4000, with Hologram's compiler and runtime
mix test        # needs a bdb server on 5434 (TEST_DATABASE_URL overrides it)
mix precommit   # warnings as errors, unused deps, format, tests
```

Dev expects bdb on 5433 (`DATABASE_URL` overrides it). See the [README at the repo root](../README.md)
for starting bdb, and for running everything with `docker compose up`.
