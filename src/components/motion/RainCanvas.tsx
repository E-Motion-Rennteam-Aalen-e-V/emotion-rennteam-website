"use client";

import { useEffect, useRef } from "react";

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  color: string;
}

const COLORS = ["#0071b5", "#5aa6d6", "#162e7b", "#38bdf8", "#7dd3fc", "#2563eb"];

export default function RainCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindropsRef = useRef<Raindrop[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    const initializeRaindrops = () => {
      raindropsRef.current = [];
      const dropCount = Math.max(30, Math.floor((canvas.width / window.devicePixelRatio / 50) * (canvas.height / window.devicePixelRatio / 50)));
      for (let i = 0; i < dropCount; i++) {
        raindropsRef.current.push({
          x: Math.random() * (canvas.width / window.devicePixelRatio),
          y: Math.random() * (canvas.height / window.devicePixelRatio),
          length: Math.random() * 15 + 10,
          speed: Math.random() * 8 + 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    initializeRaindrops();

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      raindropsRef.current.forEach((drop) => {
        drop.y += drop.speed;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
          drop.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length);
        gradient.addColorStop(0, `${drop.color}00`);
        gradient.addColorStop(0.5, `${drop.color}80`);
        gradient.addColorStop(1, drop.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        ctx.fillStyle = `${drop.color}aa`;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      initializeRaindrops();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      resizeObserverRef.current = resizeObserver;
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
