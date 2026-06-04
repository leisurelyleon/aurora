"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";

interface Layer {
  label: string;
  gradient: string;
  stack: number;
  scale: number;
}

const LAYERS: Layer[] = [
  { label: "Noise", gradient: "from-teal/30", stack: 0, scale: 1 },
  { label: "Warp", gradient: "from-violet/30", stack: 56, scale: 0.94 },
  { label: "Ramp", gradient: "from-magenta/30", stack: 112, scale: 0.88 },
];

export function Showcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Hooks called unconditionally at the top level (one per fixed layer),
  // then handed to the layers in render order.
  const y0 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const offsets: MotionValue<number>[] = [y0, y1, y2];

  return (
    <section id="showcase" className="relative overflow-hidden py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Showcase
          </p>
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Built in layers, parallaxing on scroll
          </h2>
        </Reveal>

        <div className="relative mt-16 h-80 sm:h-96">
          {LAYERS.map((layer, index) => (
            <motion.div
              key={layer.label}
              style={{ y: offsets[index] }}
              className="absolute inset-x-0 mx-auto flex max-w-3xl items-center justify-center"
              aria-hidden="true"
            >
              <div
                className={`flex h-40 w-full items-center justify-center rounded-3xl border border-foreground/10 bg-gradient-to-br ${layer.gradient} to-transparent backdrop-blur-sm`}
                style={{
                  transform: `translateY(${layer.stack}px) scale(${layer.scale})`,
                }}
              >
                <span className="font-display text-2xl font-semibold tracking-tight text-foreground/80">
                  {layer.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
