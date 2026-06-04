import { Reveal } from "@/components/motion/Reveal";

const stats = [
  { value: "1", label: "Draw call per frame" },
  { value: "6", label: "Noise octaves (FBM)" },
  { value: "0", label: "Image or video assets" },
  { value: "60", label: "Frames per second target" },
];

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            About
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Generated, not painted
          </h2>
          <p className="mt-6 text-foreground/70">
            The aurora you saw is not a loop or a texture. Every pixel is
            evaluated by a fragment shader running on the GPU: layered value
            noise is warped through itself to create flowing bands, then mapped
            through a color ramp and lit by a glow that tracks your pointer.
          </p>
          <p className="mt-4 text-foreground/70">
            Because it is procedural, it never repeats, weighs almost nothing,
            and scales to any resolution. When a device cannot run WebGL2, it
            degrades gracefully to an animated gradient &mdash; so it never
            renders blank.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6">
                <div className="font-display text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-foreground/60">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
