# aurora

A single-page landing experience powered by a **hand-written GLSL shader pipeline** on raw WebGL2 — no Three.js, no abstractions. A flowing aurora hero rendered with fractional Brownian-motion noise and animated color ramps, wrapped in scroll-driven motion, theming, and full accessibility support.

## Highlights

- **Raw WebGL2 shader hero** — vertex + fragment shaders authored by hand in GLSL, compiled and linked with real error reporting. The aurora is generated entirely on the GPU via layered value noise animated over time.
- **Fullscreen-triangle rendering** — a single oversized triangle covers the viewport in one draw call with no seam, the standard high-performance technique.
- **Graceful degradation** — feature-detects WebGL2 and listens for context loss; falls back to an animated CSS gradient so the hero never renders blank on weak hardware.
- **Three performance guards** — the render loop pauses when the hero scrolls off-screen (IntersectionObserver) or the tab is hidden (visibilitychange), and device pixel ratio is capped to protect high-DPI GPUs.
- **Accessibility first** — honors `prefers-reduced-motion`, calming the shader and disabling reveal animations on request.
- **Single-page, scroll-to-section** navigation with an active-link scroll spy, light/dark theming, magnetic buttons, parallax, and full responsive breakpoints.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · raw WebGL2 / GLSL

## Project structure

| Path | Purpose |
| --- | --- |
| `web/app/` | App Router entry — layout, single-page composition, global styles |
| `web/components/sections/` | The scroll-to-section content blocks |
| `web/components/webgl/` | React lifecycle wrapper around the renderer |
| `web/lib/webgl/` | Renderer core, shader compilation, geometry, capability detection |
| `web/lib/webgl/shaders/` | GLSL vertex and fragment shaders |
| `web/lib/hooks/` | Scroll spy, theme, reduced-motion hooks |

## Local development

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | TypeScript, no emit |

## Deployment

Deployed on **Vercel** with the project **Root Directory set to `web`**. No environment variables required — aurora is a fully client-rendered, pure-frontend experience.

## License

MIT — see [LICENSE](./LICENSE).
