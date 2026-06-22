"use client";

import { motion } from "framer-motion";

export function AnimeHero() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 右侧动漫角色 - 使用 SVG 矢量动漫风格人物 */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute right-0 bottom-0 w-80 h-96 hidden lg:block"
        style={{ filter: "drop-shadow(0 0 30px rgba(83, 216, 168, 0.15))" }}
      >
        {/* 赛博朋克风格动漫人物轮廓 */}
        <svg
          viewBox="0 0 320 480"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 背景光晕 */}
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#53d8a8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#53d8a8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64b5f6" />
              <stop offset="100%" stopColor="#53d8a8" />
            </linearGradient>
            <linearGradient id="clothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2233" />
              <stop offset="100%" stopColor="#0f1420" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 背景光圈 */}
          <circle cx="160" cy="200" r="150" fill="url(#heroGlow)" />

          {/* 身体轮廓 - 赛博朋克风格 */}
          {/* 头发 */}
          <path
            d="M120 120 Q130 80 160 70 Q190 80 200 120 Q210 100 205 80 Q195 60 160 55 Q125 60 115 80 Q110 100 120 120Z"
            fill="url(#hairGrad)"
            opacity="0.8"
          />
          {/* 侧发 */}
          <path
            d="M115 100 Q100 130 95 180 Q92 200 100 190 Q105 170 115 140Z"
            fill="#64b5f6"
            opacity="0.6"
          />
          <path
            d="M205 100 Q220 130 225 180 Q228 200 220 190 Q215 170 205 140Z"
            fill="#64b5f6"
            opacity="0.6"
          />

          {/* 面部 */}
          <ellipse
            cx="160"
            cy="130"
            rx="30"
            ry="35"
            fill="#f8f0e8"
            opacity="0.9"
          />

          {/* 眼睛 - 动漫大眼 */}
          <ellipse
            cx="148"
            cy="128"
            rx="6"
            ry="7"
            fill="#0b0e14"
            opacity="0.9"
          />
          <ellipse
            cx="172"
            cy="128"
            rx="6"
            ry="7"
            fill="#0b0e14"
            opacity="0.9"
          />
          {/* 眼睛高光 */}
          <circle cx="150" cy="126" r="2" fill="#53d8a8" filter="url(#glow)" />
          <circle cx="174" cy="126" r="2" fill="#53d8a8" filter="url(#glow)" />
          {/* 瞳孔 */}
          <circle cx="148" cy="129" r="3" fill="#1a2233" />
          <circle cx="172" cy="129" r="3" fill="#1a2233" />

          {/* 嘴巴 */}
          <path
            d="M155 142 Q160 145 165 142"
            fill="none"
            stroke="#d4a0a0"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* 脖子 */}
          <rect x="153" y="160" width="14" height="15" fill="#f8f0e8" opacity="0.8" />

          {/* 身体 - 赛博朋克外套 */}
          <path
            d="M120 175 Q130 170 160 168 Q190 170 200 175 L210 280 Q180 290 160 290 Q140 290 110 280Z"
            fill="url(#clothGrad)"
            stroke="#53d8a8"
            strokeWidth="0.5"
            opacity="0.9"
          />

          {/* 领口 */}
          <path
            d="M145 175 L160 195 L175 175"
            fill="none"
            stroke="#53d8a8"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* 发光线路装饰 */}
          <path
            d="M130 200 L140 220 L130 240"
            fill="none"
            stroke="#53d8a8"
            strokeWidth="1"
            opacity="0.4"
            filter="url(#glow)"
          />
          <path
            d="M190 200 L180 220 L190 240"
            fill="none"
            stroke="#64b5f6"
            strokeWidth="1"
            opacity="0.4"
            filter="url(#glow)"
          />

          {/* 腰带 */}
          <rect
            x="115"
            y="275"
            width="90"
            height="8"
            rx="2"
            fill="#1a2233"
            stroke="#53d8a8"
            strokeWidth="0.5"
            opacity="0.8"
          />
          {/* 腰带扣 */}
          <rect
            x="150"
            y="273"
            width="20"
            height="12"
            rx="2"
            fill="#53d8a8"
            opacity="0.6"
          />

          {/* 手臂 */}
          <path
            d="M120 180 Q100 220 90 270 Q88 280 95 275"
            fill="none"
            stroke="#1a2233"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M200 180 Q220 220 230 270 Q232 280 225 275"
            fill="none"
            stroke="#1a2233"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* 手部 */}
          <circle cx="90" cy="278" r="8" fill="#f8f0e8" opacity="0.7" />
          <circle cx="230" cy="278" r="8" fill="#f8f0e8" opacity="0.7" />

          {/* 裤子 */}
          <path
            d="M120 285 L130 400 Q140 410 155 400 L160 350 L165 400 Q180 410 190 400 L200 285"
            fill="#111622"
            stroke="#1a2233"
            strokeWidth="0.5"
            opacity="0.9"
          />

          {/* 靴子 */}
          <path
            d="M125 395 Q130 400 140 400 L145 410 Q130 415 120 410Z"
            fill="#0f1420"
            stroke="#53d8a8"
            strokeWidth="0.3"
            opacity="0.8"
          />
          <path
            d="M195 395 Q190 400 180 400 L175 410 Q190 415 200 410Z"
            fill="#0f1420"
            stroke="#53d8a8"
            strokeWidth="0.3"
            opacity="0.8"
          />

          {/* 全身轮廓光 */}
          <path
            d="M120 120 Q130 80 160 70 Q190 80 200 120 Q210 100 205 80 Q195 60 160 55 Q125 60 115 80 Q110 100 120 120Z"
            fill="none"
            stroke="#53d8a8"
            strokeWidth="0.5"
            opacity="0.3"
            filter="url(#glow)"
          />
        </svg>

        {/* 浮动特效 */}
        <div
          className="absolute top-10 right-4 w-2 h-2 rounded-full bg-primary"
          style={{
            animation: "float-particle 3s ease-in-out infinite",
            boxShadow: "0 0 10px rgba(83, 216, 168, 0.5)",
          }}
        />
        <div
          className="absolute top-24 right-12 w-1.5 h-1.5 rounded-full bg-accent"
          style={{
            animation: "float-particle 4s ease-in-out infinite reverse",
            boxShadow: "0 0 8px rgba(100, 181, 246, 0.5)",
          }}
        />
        <div
          className="absolute top-40 right-2 w-1 h-1 rounded-full bg-primary"
          style={{
            animation: "float-particle 5s ease-in-out infinite",
            boxShadow: "0 0 6px rgba(83, 216, 168, 0.4)",
          }}
        />
      </motion.div>
    </div>
  );
}
