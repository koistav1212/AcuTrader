"use client";

import React, { useRef } from "react";
import { CinematicScene } from "../components/CinematicScene";

const PIPELINE_STAGES = [
  { id: "01", label: "NEWS INGESTION", value: "3.2M / DAY" },
  { id: "02", label: "DATA STRUCTURING", value: "REAL-TIME" },
  { id: "03", label: "QUANTITATIVE MODEL", value: "ACTIVE" },
  { id: "04", label: "SIGNAL SYNTHESIS", value: "CONVERGING" },
  { id: "05", label: "STRUCTURED OUTPUT", value: "READY" }
];

export function ResearchPipelineScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  return (
    <CinematicScene 
      index={6} 
      image="/assests/img6.png" 
      position="center" 
      title="THE RESEARCH PIPELINE."
    >
      <div ref={sceneRef} className="absolute right-[15%] top-[25%] w-[35vw] flex flex-col h-full w-full">
        
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={i} className="relative flex flex-col">
            
            <div className="pipeline-card border border-border bg-surface p-4 shadow-sm z-10 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <span className="font-mono text-[10px] text-muted tracking-widest">{stage.id}</span>
                <h3 className="font-serif text-lg text-text">{stage.label}</h3>
              </div>
              <span className="font-mono text-[10px] bg-bg px-2 py-1 text-muted tracking-widest">{stage.value}</span>
            </div>

            {i < PIPELINE_STAGES.length - 1 && (
              <div className="ml-6 h-8 w-[1px] relative -my-1 z-0">
                 <div className="pipeline-line absolute inset-0 bg-accent" />
              </div>
            )}
            
          </div>
        ))}

      </div>
    </CinematicScene>
  );
}
