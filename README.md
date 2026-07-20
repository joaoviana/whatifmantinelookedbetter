# whatifmantinelookedbetter

**Live demo: [whatifmantinelookedbetter.netlify.app](https://whatifmantinelookedbetter.netlify.app/)**

When a component library first ships, nobody minds that it looks generic. The alternative was building all of it yourself, so plain and working feels like a gift. But once everyone reaches for the same handful of libraries, looking generic stops being a default and becomes a choice. Usually the wrong one.

The same applies to Mantine. It is a genuinely wonderful library. It is also instantly recognizable, and for a product you want customers to trust, being recognizable as "a Mantine app" is a liability, not a feature. People notice the seams even when they cannot name them.

This repo is a small argument that a component library does not have to look like itself. Same components, same API, one opinionated theme. That is the whole trick.

> "In a world of scarcity, we treasure tools. In a world of abundance, we treasure taste."
>
> Anu Atluru, Taste is Eating Silicon Valley

Shipping something that works is no longer the differentiator. Everyone can do that now, especially with AI. What separates products is the quiet stuff: how considered it feels, whether the details hold up when you lean in. So the interesting question was never "can Mantine do this." It was "what would Mantine look like if someone with taste sat with it for a while."

## What I believe, after sitting with it

The gap between "functional" and "premium" is almost entirely tokens. Color, radius, shadow, type. You can close most of it in a single file, before you touch a single component. That is the good news, and it is easy to underestimate.

Borders do more work than shadows. A one pixel hairline gives structure without weight, and it reads the same in light and dark. Shadow is a seasoning, not a base. A whisper of layered shadow makes a control feel liftable. A heavy one just makes it look like 2014.

Color should have to earn its place. Almost everything here is neutral. A hue appears only when it is carrying meaning, a status, a single chart series, an avatar gradient, and otherwise it stays out of the way. Restraint is not the absence of a decision. It is the decision.

There is exactly one gotcha worth writing down, because it cost me an hour. If your primary color inverts by scheme, near black in light and near white in dark, `autoContrast` alone will not save you. You have to pin `--mantine-primary-color-contrast` per scheme, or every filled button renders white on white the moment someone flips to dark. That single line is the difference between "polished" and "why is the text gone."

Structure is a design decision too. The theme is split by component group, not poured into one enormous object. `actions`, `inputs`, `dataDisplay`, and friends each live in their own file and compose into one `createTheme`. It reads better, it diffs better, and it lets many hands work at once without stepping on each other.

And patterns matter more than parts. Nobody ships a lone button. The value lives in the compositions, a table with a real toolbar, a checkout, a settings panel, a command palette, the things that already look right when you drop them in. So there is a whole Collections section, because that is where taste actually shows up.

## What is inside

Four views, switched from the floating control at the bottom of the page.

Components is the full themed library, every piece on display with its variants and states.

Collections is ten copy ready blocks composed from those components: a stats dashboard, a data table with a toolbar, pricing, sign in, settings, a command palette, team members, checkout, onboarding, and empty states.

Agent is a clean AI chat studio, the kind of layout every LLM product converges on, done with restraint.

Multi agent is an orchestration view: grainy mesh gradient avatars, a delegation timeline, and real charts rendered inline with `@mantine/charts`.

Ask anything is the newest of the AI patterns: hold ⌘ over a dashboard and it orbitises, the cursor becomes an agent orb, and clicking any tile docks a composer scoped to what you clicked, with the answer landing under the number you asked about.

## The theme is three files

```
src/theme/
  tokens.ts        colors, type, radius, shadows, per scheme CSS variables
  components/*.ts   per group component overrides
  index.ts         composes it all into one createTheme()
src/theme.css      global surfaces: dropdowns, pills, a few helpers
```

Lift `src/theme/` and `src/theme.css` into any Mantine 9 app and you get this look. That was the point.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:5180
pnpm build
pnpm preview
```

Vite, React 19, Mantine 9, `@mantine/charts`, lucide-react, Geist, TypeScript. pnpm, Node 20 or newer.

## Deploying it

It is a static single page app, so any static host will serve it for free. This one lives on **Netlify** ([whatifmantinelookedbetter.netlify.app](https://whatifmantinelookedbetter.netlify.app/)), building with `pnpm build` and publishing `dist` (see `netlify.toml`). Vercel and Cloudflare Pages work the same way. No server, no env, no database.

## A note on taste

None of this is objectively correct. Taste is not preference dressed up, but it is not law either. It is a trained instinct, and the only way to train it is to look hard at good work, ask why it feels good, and then make your own and sit with the parts that are not there yet.[^1] This repo is one pass at that, applied to a library most people accept exactly as it ships. You are meant to disagree with some of it. Take the theme, change what you would have done differently, and make something that looks like you meant it.

[^1]: The framing here is borrowed from Emil Kowalski's essay Developing Taste, which is worth your time.

## License

MIT. Take the theme, ship something that looks good.
