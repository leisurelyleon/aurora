"use client";

import { motion } from "framer-motion";
import { AuroraCanvas } from "@/components/webgl/AuroraCanvas";
import { MagneticButton } from "@/components/motion/MagneticButton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <AuroraCanvas />

      {/* Legibility scrim over the shader. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.p
          variants={item}
          className="mb-5 inline-block rounded-full border border-foreground/15 bg-background/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70 backdrop-blur-sm"
        >
          Hand-written GLSL on raw WebGL2
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl md:text-8xl"
        >
          Light that
          <span className="block bg-gradient-to-r from-accent via-magenta to-teal bg-clip-text text-transparent">
            moves like sky
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl text-base text-foreground/70 sm:text-lg"
        >
          A single-page experience where the hero is not a video and not an
          image &mdash; it is a fragment shader, computed on your GPU, sixty
          frames a second.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="#features"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background shadow-xl shadow-accent/20 transition-shadow hover:shadow-accent/40"
          >
            Explore the build
          </MagneticButton>
          <MagneticButton
            href="#about"
            className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/60"
          >
            How it works
          </MagneticButton>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-foreground/40">
        Scroll
      </div>
    </section>
  );
}
