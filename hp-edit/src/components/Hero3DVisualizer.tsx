"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero3DVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 400;
      height = canvas.height = canvas.parentElement.clientHeight || 400;
    };
    window.addEventListener("resize", handleResize);

    // 1. Generate 3D Icosahedron Vertices & Faces
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const rawVertices = [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1],
    ];

    // Normalize vertices to unit sphere
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    const edges: [number, number][] = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [9, 4], [4, 2], [2, 6], [6, 8], [8, 9],
      [4, 5], [5, 9], [9, 1], [1, 8], [8, 7],
      [7, 6], [6, 10], [10, 2], [2, 11], [11, 4]
    ];

    // 2. Point Cloud / Synaptic Orbiters
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.3 + Math.random() * 0.4;
      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: Math.random() * 2 + 1.5,
        color: i % 2 === 0 ? "#06b6d4" : "#a855f7",
      });
    }

    // 3. Mouse & Scroll Motion Variables
    let angleX = 0.3;
    let angleY = 0.2;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotX = y * 0.4;
      targetRotY = x * 0.4;
    };

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.005, 0.05);
      lastScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // 4. Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse target
      mouseX += (targetRotY - mouseX) * 0.05;
      mouseY += (targetRotX - mouseY) * 0.05;

      const baseSpeed = 0.008 + scrollVelocity;
      angleY += baseSpeed + mouseX * 0.02;
      angleX += baseSpeed * 0.7 + mouseY * 0.02;
      scrollVelocity *= 0.92;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.34;
      const fov = 3.5;

      // Project function
      const project = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // Rotate X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Perspective projection
        const pz = z2 + fov;
        const factor = pz > 0 ? fov / pz : 1;
        return {
          px: cx + x2 * scale * factor,
          py: cy + y2 * scale * factor,
          z: z2,
          factor,
        };
      };

      // Draw Glowing Center Core
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, scale * 0.8);
      glowGrad.addColorStop(0, "rgba(6, 182, 212, 0.35)");
      glowGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.15)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Project Icosahedron vertices
      const projectedVerts = vertices.map(([vx, vy, vz]) => project(vx, vy, vz));

      // Draw Edges
      ctx.lineWidth = 1.2;
      for (const [i, j] of edges) {
        const p1 = projectedVerts[i];
        const p2 = projectedVerts[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.15, Math.min(0.85, (avgZ + 1.2) / 2.4));

        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // Draw Inner Wireframe Core
      const innerVerts = vertices.map(([vx, vy, vz]) => project(vx * 0.55, vy * 0.55, vz * 0.55));
      ctx.lineWidth = 0.8;
      for (const [i, j] of edges) {
        const p1 = innerVerts[i];
        const p2 = innerVerts[j];
        ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // Draw Vertices Nodes
      for (const v of projectedVerts) {
        const radius = Math.max(2, 3.5 * v.factor);
        ctx.fillStyle = "#22d3ee";
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(v.px, v.py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Orbiting Synaptic Particles
      for (const p of particles) {
        const proj = project(p.x, p.y, p.z);
        const radius = Math.max(1, p.size * proj.factor);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[360px] max-w-[420px] aspect-square flex items-center justify-center select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-600/25 to-blue-500/10 blur-[80px] pointer-events-none" />

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-700 pointer-events-auto ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      />

      {/* Metric Badge 1 */}
      <div className="absolute top-2 left-2 sm:left-4 px-3 py-1.5 rounded-xl bg-cyber-900/90 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 shadow-glow-cyan/20 pointer-events-auto flex items-center gap-1.5 animate-float">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>NEURAL_NODE // 120 FPS</span>
      </div>

      {/* Metric Badge 2 */}
      <div className="absolute bottom-4 right-2 sm:right-4 px-3 py-1.5 rounded-xl bg-cyber-900/90 backdrop-blur-md border border-purple-500/30 text-[10px] font-mono text-purple-300 shadow-glow-purple/20 pointer-events-auto flex items-center gap-1.5 animate-float delay-1000">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span>AUTONOMOUS SWARM // ACTIVE</span>
      </div>
    </div>
  );
}
