# pic

- `frontend/`: the React app (Create React App), published to https://cbishopvelti.github.io/pic/ by
  `.github/workflows/pages.yml` on every push to master that touches it. See `frontend/README.md`.
- `backend/`: a Phoenix + [Hologram](https://hologram.page) app. The JSON API for the frontend goes
  under `/api` (just `/api/health` so far); Hologram pages live in `backend/app/`.

The database is [bdb](https://github.com/cbishopvelti/bdb). It speaks the Postgres wire protocol, so the
backend uses Ecto's Postgres adapter (Postgrex) against it. A bdb server is a single database, so there
is no `mix ecto.create` / `ecto.drop`; migrations work as usual.

## Running locally

Clone bdb next to this repo (`../bdb`), or set `BDB_DIR` to where it is.

With Docker: `docker compose up`. The frontend is on http://localhost:3000, the backend on
http://localhost:4000, and bdb on localhost:5433 (login `postgres:postgres`; WebSocket API on
ws://localhost:8080/v1/ws). bdb's data is kept in the `bdb_data` volume.

Without Docker (Elixir 1.19 / OTP 28, Node 20+, and inotify-tools on Linux):

```sh
# bdb, in its elixir/ dir: dev on 5433, and a second server on 5434 for mix test
mix bdb.server --data-dir ../../bdb-data/pic --listen 127.0.0.1:5433 --user postgres:postgres
mix bdb.server --data-dir ../../bdb-data/pic-test --listen 127.0.0.1:5434 --user postgres:postgres

cd frontend && npm install && npm start
cd backend && mix setup && mix holo
```

`mix holo` is `mix phx.server` with Hologram's compiler and runtime turned on. Under clawswap,
`clawswap.exs` starts bdb, the frontend and the backend.
