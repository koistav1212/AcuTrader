"use client";

import React, { useRef } from "react";
import Image from "next/image";

interface CinematicSceneProps {
  index: number;
  image: string;
  position: "left" | "center" | "right";
  title: string;
  /** Use for scene artwork that should extend to every edge of the viewport. */
  fullBleedImage?: boolean;
  children?: React.ReactNode;
  id?: string;
}

export function CinematicScene({
  index,
  image,
  position,
  title,
  fullBleedImage = false,
  children,
  id,
}: CinematicSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Determine the translation classes based on the chosen position
  let imagePositionClass = "object-center";
  let imageContainerClass = "items-center justify-center";
  
  if (position === "left") {
    imagePositionClass = "object-left-bottom";
    imageContainerClass = "items-end justify-start pr-0 md:pr-[20vw]";
  } else if (position === "right") {
    imagePositionClass = "object-right-bottom";
    imageContainerClass = "items-end justify-end pl-0 md:pl-[20vw]";
  } else {
    // center
    imagePositionClass = "object-bottom";
    imageContainerClass = "items-end justify-center";
  }

  return (
    <section id={id} ref={sceneRef as React.RefObject<HTMLElement>} className="scene-section relative h-screen w-full overflow-hidden bg-bg">
      {/* Z-0 Background Layer */}
      <div className="absolute inset-0 z-0 bg-bg pointer-events-none">
        {/* Subtle grid to maintain institutional feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      {/* Z-10 Image / Protagonist Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex h-full w-full">
        <div className={`relative w-full h-full flex ${imageContainerClass}`}>
          <div
            ref={imageRef}
            className={fullBleedImage ? "relative h-full w-full" : "relative mt-[10vh] h-[85%] w-[90%] md:w-[75%]"}
          >
            <Image
              src={image}
              alt={`AcuTrader Scene ${index}`}
              fill
              priority={index < 3}
              className={`hero-analyst ${fullBleedImage ? "object-cover" : "object-contain"} ${imagePositionClass} opacity-100 grayscale brightness-[0.85] contrast-[1.15]`}
            />
          </div>
        </div>
      </div>

      {/* Z-20 Atmospheric Depth Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply opacity-10 bg-gradient-to-t from-bg to-transparent" />
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-black/30 via-transparent to-black/20" />

      {/* Z-30 Typography Layer */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
        <div ref={titleRef} className="absolute left-[15%] top-[15%] max-w-4xl">
          <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase mb-4">
            0{index} / ACUTRADER
          </p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-text">
            {title}
          </h2>
        </div>
      </div>

      {/* Z-40 Data Visualization Layer (Passed as children) */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        {children}
      </div>
      
    </section>
  );
}
