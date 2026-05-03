"use client";

import { motion } from "framer-motion";

// Floating golden particles / sparkles using pure CSS animations
// Replaces the Three.js/R3F 3D scene (~500KB+) with a zero-dependency CSS alternative

const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 6 + 6,
  opacity: Math.random() * 0.5 + 0.2,
}));

const ORBS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  size: Math.random() * 200 + 100,
  x: Math.random() * 80 + 10,
  y: Math.random() * 80 + 10,
  delay: Math.random() * 10,
  duration: Math.random() * 8 + 10,
  color: i % 2 === 0 ? "rgba(201,169,110,0.06)" : "rgba(232,160,191,0.04)",
}));

export function HeroCanvas() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#0F0F0F] to-[#1A1A1A]" />

      {/* Animated gradient orbs */}
      {ORBS.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className="absolute rounded-full animate-hero-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
          }}
        />
      ))}

      {/* Radial gold glow - top right */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.12)_0%,transparent_50%)]" />

      {/* Radial rose glow - bottom left */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,160,191,0.08)_0%,transparent_50%)]" />

      {/* Rotating golden ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-hero-ring"
        style={{
          width: "min(60vw, 400px)",
          height: "min(60vw, 400px)",
          borderRadius: "50%",
          border: "1.5px solid rgba(201,169,110,0.15)",
          boxShadow: "0 0 60px rgba(201,169,110,0.05), inset 0 0 60px rgba(201,169,110,0.03)",
        }}
      />

      {/* Second ring - offset and smaller */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-[30%] -translate-y-[40%] animate-hero-ring-reverse"
        style={{
          width: "min(45vw, 280px)",
          height: "min(45vw, 280px)",
          borderRadius: "50%",
          border: "1px solid rgba(232,160,191,0.1)",
          boxShadow: "0 0 40px rgba(232,160,191,0.04)",
        }}
      />

      {/* Floating sparkles */}
      {SPARKLES.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="absolute rounded-full animate-hero-sparkle"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            background: sparkle.id % 3 === 0
              ? "rgba(232,160,191,0.8)"
              : "rgba(201,169,110,0.9)",
            boxShadow: sparkle.id % 3 === 0
              ? "0 0 6px rgba(232,160,191,0.4)"
              : "0 0 8px rgba(201,169,110,0.5)",
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            opacity: sparkle.opacity,
          }}
        />
      ))}

      {/* Geometric accent lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#C9A96E" strokeWidth="0.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#C9A96E" strokeWidth="0.5" />
        <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}
