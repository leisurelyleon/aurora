import { Reveal } from "@/components/motion/Reveal";

const features = [
  {
    title: "Fullscreen-triangle pipeline",
    body: "One oversized triangle covers the viewport in a single draw call with no diagonal seam — the standard high-performance technique over a quad.",
  },
  {
    title: "Domain-warped FBM",
    body: "Fractional Brownian motion fed through itself produces the organic, ever-shifting aurora bands. No two frames are ever identical.",
  },
  {
    title: "Three performance guards",
    body: "The loop pauses when the hero scrolls away or the tab is hidden, and device pixel ratio is capped so high-DPI screens never melt the GPU.",
  },
  {
    title: "Graceful degradation",
    body: "WebGL2 is feature-detected and context loss is handled live; an animated CSS gradient takes over so the hero is never blank.",
  },
  {
    title: "Reduced-motion aware",
    body: "When the OS requests calm, the shader freezes to a single still frame and scroll reveals are disabled — accessibility as a first-class concern.",
  },
  {
    title: "Theme-reactive shader",
    body: "A single uniform blends the same field between a deep cosmic dark mode and a soft, luminous light mode without rebuilding the context.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Features
        </p>
        <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Engineered like a systems project, not a slideshow
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={(index % 3) * 0.08}>
            <article className="group h-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-7 transition-colors hover:border-accent/40">
              <div className="mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-accent to-magenta transition-all group-hover:w-16" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                {feature.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
