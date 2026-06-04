import { linkProgram } from "@/lib/webgl/shader";
import { createFullscreenTriangle } from "@/lib/webgl/geometry";
import { AURORA_VERT } from "@/lib/webgl/shaders/aurora.vert";
import { AURORA_FRAG } from "@/lib/webgl/shaders/aurora.frag";

export interface RendererOptions {
  /** 0.0 = dark, 1.0 = light. */
  theme: number;
}

/**
 * Owns the WebGL2 context, compiled program, geometry, and the render loop for
 * the aurora background. The component layer (AuroraCanvas) drives lifecycle:
 * start/stop on visibility, renderStatic for reduced-motion users, dispose on
 * unmount. The renderer never touches React or the DOM beyond its canvas.
 */
export class AuroraRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly canvas: HTMLCanvasElement;
  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly buffer: WebGLBuffer;

  private readonly uTime: WebGLUniformLocation | null;
  private readonly uResolution: WebGLUniformLocation | null;
  private readonly uTheme: WebGLUniformLocation | null;
  private readonly uPointer: WebGLUniformLocation | null;

  private rafId: number | null = null;
  private startTime = 0;
  private elapsed = 0;
  private theme: number;

  private readonly pointer = { x: 0.5, y: 0.5 };
  private readonly targetPointer = { x: 0.5, y: 0.5 };

  constructor(canvas: HTMLCanvasElement, options: RendererOptions) {
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      throw new Error("WebGL2 is not available in this context.");
    }

    this.gl = gl;
    this.canvas = canvas;
    this.theme = options.theme;

    this.program = linkProgram(gl, AURORA_VERT, AURORA_FRAG);

    const positionLocation = gl.getAttribLocation(this.program, "a_position");
    const geometry = createFullscreenTriangle(gl, positionLocation);
    this.vao = geometry.vao;
    this.buffer = geometry.buffer;

    this.uTime = gl.getUniformLocation(this.program, "u_time");
    this.uResolution = gl.getUniformLocation(this.program, "u_resolution");
    this.uTheme = gl.getUniformLocation(this.program, "u_theme");
    this.uPointer = gl.getUniformLocation(this.program, "u_pointer");

    this.resize();
  }

  setTheme(theme: number): void {
    this.theme = theme;
  }

  /** Pointer position in normalized coordinates, origin bottom-left. */
  setPointer(x: number, y: number): void {
    this.targetPointer.x = x;
    this.targetPointer.y = y;
  }

  /** Match the drawing buffer to the CSS size, capping DPR to protect the GPU. */
  resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(Math.floor(this.canvas.clientWidth * dpr), 1);
    const height = Math.max(Math.floor(this.canvas.clientHeight * dpr), 1);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawFrame(): void {
    const gl = this.gl;
    this.resize();
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    if (this.uTime) gl.uniform1f(this.uTime, this.elapsed);
    if (this.uResolution) {
      gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height);
    }
    if (this.uTheme) gl.uniform1f(this.uTheme, this.theme);
    if (this.uPointer) {
      gl.uniform2f(this.uPointer, this.pointer.x, this.pointer.y);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private readonly loop = (now: number): void => {
    if (this.startTime === 0) {
      this.startTime = now;
    }
    this.elapsed = (now - this.startTime) / 1000;

    // Ease the pointer toward its target for a smooth trailing glow.
    this.pointer.x += (this.targetPointer.x - this.pointer.x) * 0.05;
    this.pointer.y += (this.targetPointer.y - this.pointer.y) * 0.05;

    this.drawFrame();
    this.rafId = window.requestAnimationFrame(this.loop);
  };

  /** Begin the animation loop (idempotent). */
  start(): void {
    if (this.rafId === null) {
      this.startTime = 0;
      this.rafId = window.requestAnimationFrame(this.loop);
    }
  }

  /** Halt the animation loop (idempotent). */
  stop(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Render a single calm frame, used when prefers-reduced-motion is set. */
  renderStatic(): void {
    this.stop();
    this.elapsed = 0;
    this.pointer.x = 0.5;
    this.pointer.y = 0.5;
    this.targetPointer.x = 0.5;
    this.targetPointer.y = 0.5;
    this.drawFrame();
  }

  /** Release all GPU resources. */
  dispose(): void {
    this.stop();
    const gl = this.gl;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.buffer);
  }
}
