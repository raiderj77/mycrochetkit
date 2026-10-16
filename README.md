# MyCrochetKit recovery site

MyCrochetKit is temporarily a redirect-only recovery site. The previous application source remains in this repository for a separately reviewed security and privacy rebuild, but it is not compiled or served by the production build.

## Production behavior

- Closely matching calculator and educational URLs permanently redirect to the corresponding canonical FiberTools page.
- Account, project, pattern, roadmap, and unmatched URLs show an honest no-index retirement page.
- The recovery page does not initialize Firebase, analytics, authentication, voice recognition, or the previous application bundle.
- There is intentionally no sitemap while the site is in this state. Crawlers can still follow permanent redirects.

## Verification

```sh
npm test
npm audit --omit=dev
```

`npm test` validates the required redirect map and creates the dependency-free static `dist` output.

## Relaunch boundary

Do not restore the application build until its Firestore authorization, account lifecycle, privacy controls, voice/offline claims, dependency audit, lint failures, route inventory, and end-to-end production behavior have been independently repaired and verified.
