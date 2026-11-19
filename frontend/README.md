# pic frontend

The property investment calculator: a Create React App site, published to
https://cbishopvelti.github.io/pic/ by `.github/workflows/pages.yml` on every push to master that
touches `frontend/`. It uses a `HashRouter`, so it works from the `/pic/` sub-path.

```sh
npm install
npm start       # dev server on http://localhost:3000
npm test        # Jest, in watch mode
npm run build   # production build in build/
```

- `src/data/data.js` holds the properties. `mortgageLtv` and `mortgagePercent` are percentages, and
  `rooms` are monthly rents.
- `src/calculator/calc.js` has the sums, shared by the calculator page and the property picker.
- `src/properties/source.js` is the one place that decides where the property list comes from.
- `src/clawswap/` is clawswap's bottom bar. It only renders on the dev server.

CI builds with `CI=true`, so a lint warning fails the deploy. Run `CI=true npm run build` to check
before pushing.

See the [README at the repo root](../README.md) for the backend and running everything together.
