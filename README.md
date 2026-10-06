# NDR Smart Spaces

Official website for NDR Smart Spaces Pvt. Ltd., the logistics and industrial infrastructure development platform of the NDR Group.

Built with Next.js (App Router, static export), TypeScript and CSS Modules.

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000 and redirects to `/en/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the static export in `out/` |
| `npm start` | Serve the exported site locally |
| `npm run typecheck` | Type-check the project |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the codebase with Prettier |
| `npm run cms:admin` | Start the local content admin |
| `npm run cms:export` | Regenerate the content modules from the CMS store |
| `npm run verify:cms` | Verify CMS content and generated modules |

## Project structure

| Path | Contents |
| --- | --- |
| `app/` | Routes and layouts (`app/[locale]/...`) |
| `src/components/` | Page sections, layout and UI components |
| `src/lib/data/` | Site content; `generated/` is produced from the CMS store |
| `src/styles/` | Design tokens and global styles |
| `public/` | Images, videos, logos and downloadable documents |
| `admin/` | Local CMS admin server and interface |
| `scripts/` | CMS tooling, data imports and the static server |
| `docs/` | Architecture notes; planning documents live in `docs/planning/` |
| `Project resources/` | Source material supplied for the site |

## Content

Most copy lives in `src/lib/data/`. Files under `src/lib/data/generated/` mirror the CMS store, so change content through the admin or the matching CMS record rather than editing those files by hand, then run `npm run cms:export` and `npm run verify:cms`.

## Deployment

`npm run build` writes a fully static site to `out/`, which can be served from any static host.
