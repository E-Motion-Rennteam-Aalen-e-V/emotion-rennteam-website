"use client";

import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  width: number;
  colorIndex: number;
  trail: number;
}

const COLORS = [
  "#0071b5", // accent blue
  "#5aa6d6", // accent light
  "#162e7b", // accent dark
  "#38bdf8", // electric cyan
  "#7dd3fc", // sky light
  "#2563eb", // electric blue
];

export default function RainCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let drops: Drop[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initDrops();
    }

    function initDrops() {
      if (!canvas) return;
      const count = Math.floor((canvas.width / 1200) * 35) + 12;
      drops = Array.from({ length: count }, () => createDrop());
    }

    function createDrop(startFromTop = false): Drop {
      const w = canvas!.width;
      const h = canvas!.height;
      return {
        x: Math.random() * w,
        y: startFromTop ? -Math.random() * h * 0.6 : Math.random() * h * -1,
        len: 40 + Math.random() * 120,
        speed: 3 + Math.random() * 6,
        opacity: 0.35 + Math.random() * 0.55,
        width: 1 + Math.random() * 1.5,
        colorIndex: Math.floor(Math.random() * COLORS.length),
        trail: 0.6 + Math.random() * 0.3,
      };
    }

    function draw() {
      if (!canvas || !ctx) return;

      // Semi-transparent overlay — trails fade naturally
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const color = COLORS[d.colorIndex];

        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.4, color + "40");
        grad.addColorStop(1, color);

        ctx.save();
        ctx.globalAlpha = d.opacity;
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();

        // Bright tip
        ctx.globalAlpha = d.opacity * 0.9;
        ctx.fillStyle = "#fff";
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.width * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        d.y += d.speed;

        if (d.y - d.len > canvas.height) {
          drops[i] = createDrop(true);
          drops[i].y = -10;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
