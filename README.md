# pic

- `frontend/`: the React app (Create React App), published to https://cbishopvelti.github.io/pic/ by
  `.github/workflows/pages.yml` on every push to master that touches it. See `frontend/README.md`.
- `backend/`: a Phoenix + [Hologram](https://hologram.page) app with SQLite through Ecto. The JSON API for
  the frontend goes under `/api` (just `/api/health` so far); Hologram pages live in `backend/app/`.
  See `backend/README.md`.

## Running locally

With Docker: `docker compose up`, then the frontend is on http://localhost:3000 and the backend on
http://localhost:4000. The SQLite file is kept in the `backend_data` volume.

Without Docker (Elixir 1.19 / OTP 28, Node 20+, and inotify-tools on Linux):

```sh
cd frontend && npm install && npm start
cd backend && mix setup && mix holo
```

`mix holo` is `mix phx.server` with Hologram's compiler and runtime turned on. Under clawswap,
`clawswap.exs` starts both.
