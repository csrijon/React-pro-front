"use client";

import React, { useState, useRef, MouseEvent } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(6, 182, 212, 0.2)"
  onClick?: () => void;
}

export default function TiltCard({
  children,
  className = "",
  glowColor = "rgba(6, 182, 212, 0.25)",
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle 3-degree tilt so corners never get clipped or hide behind top boundaries
    const rX = ((y - centerY) / centerY) * -3;
    const rY = ((x - centerX) / centerX) * 3;

    setRotateX(rX);
    setRotateY(rY);
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
      className={`relative h-full flex flex-col transition-all duration-300 ${className}`}
    >
      {/* Mouse spotlight torch glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-100 transition-opacity duration-300 overflow-hidden z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Inner Content - strictly full height flex container */}
      <div className="relative z-10 h-full flex-1 flex flex-col">{children}</div>
    </div>
  );
}
