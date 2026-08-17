"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VerticalNav } from "./components/VerticalNav";
import { ResearchProgress } from "./components/ResearchProgress";
import { OpenPlatformButton } from "@/components/auth/OpenPlatformButton";

import { HeroScene } from "./scenes/HeroScene";
import { SignalScene } from "./scenes/SignalScene";
import { MeasurementScene } from "./scenes/MeasurementScene";
import { CorrelationScene } from "./scenes/CorrelationScene";
import { SynthesisScene } from "./scenes/SynthesisScene";
import { ResearchPipelineScene } from "./scenes/ResearchPipelineScene";
import { ThesisScene } from "./scenes/ThesisScene";

export function ResearchExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      const sceneElements = gsap.utils.toArray<HTMLElement>(".scene-section");

      sceneElements.forEach((scene, i) => {
        ScrollTrigger.create({
          trigger: scene,
          start: "top center",
          end: "bottom center",
          onEnter: () => setCurrentSection(i + 1),
          onEnterBack: () => setCurrentSection(i + 1),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-bg text-text selection:bg-accent selection:text-surface"
    >
      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-surface pointer-events-none">
        <div className="font-serif text-xl tracking-wide flex flex-col pointer-events-auto cursor-pointer">
          <span className="font-bold">ACUTRADER</span>
          <span className="text-[10px] font-sans tracking-widest uppercase opacity-70">AI Market Intelligence</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono tracking-widest pointer-events-auto">
          <button onClick={() => document.getElementById('scene-0')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="cursor-pointer hover:opacity-70 transition-opacity">PLATFORM</button>
          <button onClick={() => document.getElementById('scene-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="cursor-pointer hover:opacity-70 transition-opacity">RESEARCH ENGINE</button>
          <button onClick={() => document.getElementById('scene-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="cursor-pointer hover:opacity-70 transition-opacity">ARCHITECTURE</button>
          <button onClick={() => document.getElementById('scene-4')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="cursor-pointer hover:opacity-70 transition-opacity">METHODOLOGY</button>
          <button onClick={() => document.getElementById('scene-6')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="cursor-pointer hover:opacity-70 transition-opacity text-accent">RESULTS</button>
        </div>

        <div className="pointer-events-auto">
          <OpenPlatformButton />
        </div>
      </nav>

      {/* Persistent Left Navigation */}
      <VerticalNav currentSection={currentSection} />

      {/* Sticky bottom-right progress / narrative label (spec section 8) */}
      <ResearchProgress currentSection={currentSection} total={7} />

      {/* The Continuous Cinematic Narrative */}
      <div className="relative z-10 w-full flex flex-col">
        <div id="scene-0"><HeroScene /></div>
        <div id="scene-1"><SignalScene /></div>
        <div id="scene-2"><MeasurementScene /></div>
        <div id="scene-3"><CorrelationScene /></div>
        <div id="scene-4"><SynthesisScene /></div>
        <div id="scene-5"><ResearchPipelineScene /></div>
        <div id="scene-6"><ThesisScene /></div>
      </div>
    </div>
  );
}
