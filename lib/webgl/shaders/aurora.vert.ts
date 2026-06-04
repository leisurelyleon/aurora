/**
 * Vertex shader for the aurora background.
 *
 * Drives a single oversized "fullscreen triangle" (see geometry.ts). The only
 * job here is to pass clip-space positions straight through and hand the
 * fragment shader a 0..1 UV so it can paint the aurora field.
 */
export const AURORA_VERT = /* glsl */ `#version 300 es
precision highp float;

in vec2 a_position;
out vec2 v_uv;

void main() {
  // a_position spans the oversized triangle in clip space [-1, 1].
  // Remap to UV [0, 1] for the fragment shader.
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
