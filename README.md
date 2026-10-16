# MyCrochetKit

MyCrochetKit is a dependency-free, accountless crochet project planner. It keeps project details in the visitor's browser while FiberTools remains the canonical calculator and reference library.

## Product boundary

- **MyCrochetKit:** individual project organization, materials, gauge, row progress, notes, local backup, and printing.
- **FiberTools:** calculators, formulas, conversions, educational guides, and public reference material.

The production planner does not initialize Firebase, authentication, analytics, advertising, voice recognition, or the previous application bundle. The previous application source remains in the repository for historical reference and a separately reviewed rebuild; it is not compiled or served.

## Privacy model

- No account or cloud database.
- Planner data is stored in browser `localStorage`.
- Users can export and import a versioned JSON backup.
- The Content Security Policy blocks network connections from the planner.
- Clearing browser storage can remove projects, so the UI explains the backup limitation.

## URL behavior

- Closely matching legacy calculator and educational URLs permanently redirect to the corresponding canonical FiberTools page.
- `/`, `/about`, and `/privacy` are unique, indexable MyCrochetKit pages.
- Missing URLs return a true 404 page rather than a catch-all soft 404.

## Verification

```sh
npm test
npm audit --omit=dev
```

`npm test` runs planner-unit tests, validates the redirect map, checks privacy/SEO/security contracts, and creates the static `dist` output.

## Relaunch boundary

Do not restore the previous Firebase application build until its Firestore authorization, account lifecycle, privacy controls, voice/offline claims, dependency audit, lint failures, route inventory, and end-to-end production behavior have been independently repaired and verified. Cloud sync, accounts, subscriptions, uploads, and paid infrastructure require fresh demand evidence and a separate reviewed design.
