/**
 * Fullscreen-triangle geometry.
 *
 * A single oversized triangle covers the entire clip-space viewport in one
 * draw call with no diagonal seam, which is cheaper and cleaner than a quad.
 * Vertices intentionally extend past the [-1, 1] box: (-1,-1), (3,-1), (-1,3).
 */
export interface FullscreenTriangle {
  vao: WebGLVertexArrayObject;
  buffer: WebGLBuffer;
}

export function createFullscreenTriangle(
  gl: WebGL2RenderingContext,
  positionLocation: number,
): FullscreenTriangle {
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);

  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  if (!vao || !buffer) {
    throw new Error("WebGL: failed to allocate geometry resources.");
  }

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  return { vao, buffer };
}
