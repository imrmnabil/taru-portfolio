# taru-portfolio

Single-page portfolio for Tarunnyamoye Kundu — Next.js 15 (App Router) exported
to static HTML, with [Keystatic](https://keystatic.com) as an on-disk CMS and a
custom side-by-side editing Studio.

**Editing the content?** See the [CMS guide](docs/CMS-GUIDE.md) — no code needed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run cms` | Dev server **plus** the CMS, and opens the Studio in your browser |
| `npm run dev` | Dev server, site only |
| `npm run build` | Static export to `out/`, then image optimisation |
| `npm run lint` / `npm run format` | Biome |

`npm run cms -- --port 4000` passes flags through. `CMS_NO_OPEN=1` skips the
browser launch.

## How the CMS coexists with `output: "export"`

Keystatic's API route exports `POST`, and Next allows only `GET` route handlers
under static export — so the CMS cannot exist in a production build.

Every CMS-only route file is therefore named `*.keystatic.tsx` / `*.keystatic.ts`,
and that extension is registered in `pageExtensions` **only** when `KEYSTATIC=1`
(see [next.config.ts](next.config.ts)). With the flag unset Next sees no
`page`/`route` file in those folders, so they — and everything they import —
vanish from the build. `npm run build` emits only `/` and `/_not-found`.

Dev-only routes:

```
src/app/keystatic/…                       Keystatic Admin UI
src/app/api/keystatic/[...params]/…       Keystatic's read/write API
src/app/studio/…                          the split-pane editor
src/app/preview/…                         preview target for the Studio
src/app/api/content-version/…             fingerprint of content/ + public/images
src/app/api/preview-content/…             renders unsaved drafts
```

## Content

Content lives in [`content/`](content/) as YAML and Markdown, edited through
Keystatic and committed like any other source file. The schema is
[keystatic.config.ts](keystatic.config.ts).

- **Singletons** — `site`, `person`, `experience`, `education`, `publications`,
  `test-scores`, `ordering`
- **Collections** — `achievements/*.md`, `projects/*.md` (frontmatter + a Markdown
  body edited as rich text)

Keystatic collections are unordered, so [`content/ordering.yaml`](content/ordering.yaml)
holds a draggable list of slugs. [`src/lib/content.ts`](src/lib/content.ts) sorts
by it and **appends any entry missing from the list**, so a newly created entry
never silently disappears.

Images and PDFs are stored under `public/` and referenced by their full public
path (`/images/achievements/foo.png`) — that is the exact string Keystatic
serialises, and the Reader returns it untouched.

### Rendering

[`src/lib/content.ts`](src/lib/content.ts) reads everything through Keystatic's
Reader and maps it onto the view types in
[`src/types/contents.types.ts`](src/types/contents.types.ts). It is server-only.

`src/app/page.tsx` is a server component that awaits `getSiteContent()` and hands
the result to [`src/components/HomePage.tsx`](src/components/HomePage.tsx), which
holds all the client-side behaviour. Under `output: "export"` this runs at build
time and still produces fully static HTML.

## Live preview

Keystatic in local mode writes the entry being edited to IndexedDB on every
keystroke, already serialised to the exact bytes a Save would write. The Studio
reads that store, POSTs the bytes to `/api/preview-content`, which overlays them
on a throwaway copy of `content/` and renders through the same loader. The result
is pushed into the preview frame over `postMessage`.

```
keystroke → IndexedDB draft → /api/preview-content → postMessage → re-render
```

The working tree is never written to, and React re-renders in place so scroll
position and carousels survive.

**Saves reload the frame instead.** A save can swap an image under its existing
filename; React would re-render with an identical `src` and the browser would
keep its decoded bitmap, so the picture would never appear to change. The Studio
watches `content/` *and* `public/images` and does a real reload when either
changes on disk.

## Images

`next-image-export-optimizer` generates WEBP variants at build time. It has no
dev mode — it always requests those pre-generated files — so in dev a new image
404s and, worse, a *replaced* image still loads its stale variant successfully.

[`src/components/ui/exported-image.tsx`](src/components/ui/exported-image.tsx)
wraps it and passes `unoptimized` when `NODE_ENV !== "production"`, so dev serves
the originals from `public/`. `NODE_ENV` is inlined at build time, so production
is untouched and fully optimised.

**A newly uploaded image is only optimised by `npm run build`.** Run one before
deploying.

## Deployment

Every push to `main` builds and publishes to GitHub Pages via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). It runs `npm ci`,
`npm run build`, and uploads `out/`.

The workflow also fails the build if anything matching `keystatic`, `studio`,
`preview`, or `api` appears in `out/` — the CMS must never ship to a public URL,
and that guard is what keeps the `pageExtensions` trick honest.

**One-time setup:** repo *Settings → Pages → Source: **GitHub Actions***.

**The site is built for the domain root** (no `basePath`). That is correct for a
user site — a repo named `<user>.github.io` — or a custom domain. If it is ever
served from a project subpath such as `user.github.io/taru-portfolio`, add
`basePath` and `assetPrefix` to [next.config.ts](next.config.ts), or every asset
will 404 and the page will render unstyled.

`KEYSTATIC` is deliberately left unset in CI: that is what keeps `output:
"export"` on and drops the CMS routes.

## Stack

Next.js 15.5 · React 19 · TypeScript · Tailwind CSS v4 (CSS-first, no config
file — see `src/app/globals.css`) · Keystatic · Framer Motion · Embla Carousel ·
react-markdown · Formspree · Biome.
