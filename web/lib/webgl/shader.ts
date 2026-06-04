/**
 * GLSL compilation helpers with real error reporting.
 *
 * Silent shader failures are the single most painful class of WebGL bug, so
 * every step throws a descriptive Error containing the driver info log.
 */

export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("WebGL: failed to allocate a shader object.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "unknown error";
    gl.deleteShader(shader);
    const kind = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
    throw new Error(`WebGL: failed to compile ${kind} shader:\n${log}`);
  }
  return shader;
}

export function linkProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  if (!program) {
    throw new Error("WebGL: failed to allocate a program object.");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Shaders are baked into the program once linked; release them either way.
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "unknown error";
    gl.deleteProgram(program);
    throw new Error(`WebGL: failed to link program:\n${log}`);
  }
  return program;
}
