"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0f172a] flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* Left Side: Brand & Hero */}
        <div className="flex-1 text-center md:text-left space-y-6 animate-in slide-in-from-left-4 duration-1000">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
             <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
               <Image 
                 src="/main_icon.png" 
                 alt="AcuTrader Logo" 
                 width={50} 
                 height={50} 
                 className="object-contain" // Fallback if image ratio varies
                 priority
               />
             </div>
             <div>
               <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                 AcuTrader
               </h1>
               <p className="text-blue-200 mt-1 font-medium tracking-wide text-sm uppercase opacity-80">
                 Market Intelligence Platform
               </p>
             </div>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto md:mx-0">
             <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
               Master the Markets with Precision
             </h2>
             <p className="text-gray-400 text-lg leading-relaxed">
               Experience the next generation of trading tools. Real-time data, advanced analytics, and professional grade execution in one unified dashboard.
             </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-sm text-gray-500 pt-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Real-time Data</span>
             </div>
             <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600" />
             <div>Bank-grade Security</div>
             <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600" />
             <div>24/7 Support</div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="w-full max-w-md">
           {isLogin ? (
             <LoginForm onToggle={toggleAuthMode} />
           ) : (
             <SignupForm onToggle={toggleAuthMode} />
           )}
        </div>

      </div>
    </div>
  );
}
