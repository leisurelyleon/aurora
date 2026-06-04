/**
 * Fragment shader for the aurora background.
 *
 * The aurora is generated entirely on the GPU: layered value noise (fractional
 * Brownian motion) is domain-warped over time to produce flowing bands, then
 * mapped through a cosmic color ramp. A pointer-following glow and a theme
 * uniform let the same shader serve both the dark hero and a softer light mode.
 */
export const AURORA_FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;       // seconds since start
uniform vec2  u_resolution; // drawing-buffer size in pixels
uniform float u_theme;      // 0.0 = dark, 1.0 = light
uniform vec2  u_pointer;    // pointer position, normalized [0, 1]

// Hash a 2D point to a pseudo-random scalar in [0, 1].
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Smooth value noise built on the hash above.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f); // Hermite smoothing
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractional Brownian motion: sum of octaves at increasing frequency.
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = uv;
  p.x *= aspect; // keep the flow from stretching on wide screens

  float t = u_time * 0.06;

  // Domain warping: feed FBM through itself twice for organic, flowing bands.
  vec2 q = vec2(fbm(p + vec2(0.0, t)),
                fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                fbm(p + 4.0 * q + vec2(8.3, 2.8) - 0.12 * t));
  float f = fbm(p + 4.0 * r);

  // Pointer-following glow.
  vec2 ptr = u_pointer;
  ptr.x *= aspect;
  float glow = 0.085 / (distance(p, ptr) + 0.13);

  // Cosmic color ramp.
  vec3 teal    = vec3(0.05, 0.55, 0.55);
  vec3 violet  = vec3(0.35, 0.15, 0.78);
  vec3 magenta = vec3(0.95, 0.30, 0.58);
  vec3 green   = vec3(0.10, 0.88, 0.66);

  vec3 col = mix(teal, violet, clamp(f * 1.6, 0.0, 1.0));
  col = mix(col, magenta, clamp(r.x * r.x, 0.0, 1.0));
  col = mix(col, green, clamp(q.y * 0.7, 0.0, 1.0));
  col += glow * green;

  // Concentrate the aurora toward the top of the frame.
  float vfall = smoothstep(0.0, 1.0, 1.0 - uv.y);
  col *= 0.55 + 0.85 * vfall;

  // Light theme: wash the field toward a soft bright background.
  vec3 lightBg = vec3(0.93, 0.94, 0.98);
  col = mix(col, mix(lightBg, col, 0.55), u_theme);

  // Subtle vignette for depth.
  vec2 vc = uv - 0.5;
  col *= 1.0 - dot(vc, vc) * 0.6;

  fragColor = vec4(col, 1.0);
}
`;
