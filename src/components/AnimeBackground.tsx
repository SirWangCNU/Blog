"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export function AnimeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 初始化粒子
    const colors = [
      "rgba(83, 216, 168, ",
      "rgba(100, 181, 246, ",
      "rgba(129, 199, 245, ",
      "rgba(179, 157, 219, ",
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;

    // 鼠标跟踪
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制粒子
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // 边界反弹
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 鼠标吸引效果
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += dx * 0.00008;
          p.vy += dy * 0.00008;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();
      });

      // 绘制连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(83, 216, 168, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <>
      {/* 粒子画布 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* 动漫风格装饰元素 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* 漂浮光圈 */}
        <div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(83, 216, 168, 0.3), transparent 70%)",
            top: "10%",
            right: "5%",
            animation: "float-slow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(100, 181, 246, 0.3), transparent 70%)",
            bottom: "15%",
            left: "8%",
            animation: "float-slow 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-32 h-32 rounded-full opacity-8"
          style={{
            background:
              "radial-gradient(circle, rgba(179, 157, 219, 0.25), transparent 70%)",
            top: "50%",
            left: "60%",
            animation: "float-slow 12s ease-in-out infinite",
          }}
        />

        {/* 赛博朋克线条装饰 */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#53d8a8" stopOpacity="0" />
              <stop offset="50%" stopColor="#53d8a8" stopOpacity="1" />
              <stop offset="100%" stopColor="#53d8a8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* 斜线装饰 */}
          <line
            x1="0"
            y1="30%"
            x2="100%"
            y2="70%"
            stroke="url(#lineGrad)"
            strokeWidth="0.5"
          />
          <line
            x1="10%"
            y1="0"
            x2="90%"
            y2="100%"
            stroke="url(#lineGrad)"
            strokeWidth="0.3"
          />
          {/* 几何装饰 */}
          <circle
            cx="85%"
            cy="15%"
            r="40"
            fill="none"
            stroke="#53d8a8"
            strokeWidth="0.3"
            opacity="0.3"
          />
          <circle
            cx="85%"
            cy="15%"
            r="60"
            fill="none"
            stroke="#64b5f6"
            strokeWidth="0.2"
            opacity="0.2"
          />
        </svg>

        {/* 动漫风格文字装饰（日文假名） */}
        <div
          className="absolute text-xs font-mono opacity-5 select-none"
          style={{
            top: "20%",
            right: "15%",
            color: "#53d8a8",
            writingMode: "vertical-rl",
            animation: "fade-float 6s ease-in-out infinite",
            letterSpacing: "0.3em",
          }}
        >
          システム稼働中
        </div>
        <div
          className="absolute text-xs font-mono opacity-5 select-none"
          style={{
            bottom: "25%",
            left: "5%",
            color: "#64b5f6",
            writingMode: "vertical-rl",
            animation: "fade-float 8s ease-in-out infinite reverse",
            letterSpacing: "0.3em",
          }}
        >
          接続確認完了
        </div>
        <div
          className="absolute text-xs font-mono opacity-4 select-none"
          style={{
            top: "60%",
            right: "8%",
            color: "#b39ddb",
            animation: "fade-float 10s ease-in-out infinite",
          }}
        >
          ▌▌▌ AI_CORE ACTIVE
        </div>
      </div>
    </>
  );
}
