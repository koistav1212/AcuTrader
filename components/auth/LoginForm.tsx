"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

interface LoginFormProps {
  onToggle?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validate()) return;

    setIsLoading(true);
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store auth data via Context
      login(data.token, data.user);

      // Redirect to next path
      router.replace(next);

    } catch (err: any) {
      setLoginError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left Branding */}
        <div className="hidden md:block space-y-8">
          <div>
            <p className="research-label mb-4">ACUTRADER</p>
            <h1 className="font-display text-5xl md:text-6xl leading-tight">
              MARKET<br/>
              INTELLIGENCE <br/>
              RESEARCH <br/>
              EXECUTION
            </h1>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="w-full max-w-md mx-auto space-y-12">
          
          <div className="flex justify-between border-b border-[var(--border)] pb-4">
            <span className="research-label">ACUTRADER</span>
            <span className="research-label">SYSTEM ACCESS</span>
          </div>

          <div>
            <p className="research-label mb-2">SECURE ACCESS</p>
            <h2 className="font-display text-5xl">
              LOGIN TO<br/>
              PROCEED.
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {loginError && (
              <div className="p-3 border border-red-500/20 text-red-500 font-mono text-[10px] tracking-wider uppercase">
                {loginError}
              </div>
            )}

            <div className="space-y-2">
              <label className="research-label block">EMAIL</label>
              <input
                type="email"
                className={`
                  w-full
                  border-b border-[var(--border)]
                  bg-transparent
                  px-0 py-4
                  font-mono text-sm
                  outline-none
                  transition
                  focus:border-[var(--accent)]
                  ${errors.email ? 'border-red-500/50' : ''}
                `}
                placeholder="system@acutrader.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-[9px] font-mono text-red-500 mt-1 uppercase tracking-widest">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="research-label block">PASSWORD</label>
              <input
                type="password"
                className={`
                  w-full
                  border-b border-[var(--border)]
                  bg-transparent
                  px-0 py-4
                  font-mono text-sm
                  outline-none
                  transition
                  focus:border-[var(--accent)]
                  ${errors.password ? 'border-red-500/50' : ''}
                `}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="text-[9px] font-mono text-red-500 mt-1 uppercase tracking-widest">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                group
                w-full
                bg-[var(--text-primary)]
                px-7 py-4
                font-mono text-[10px]
                tracking-[0.18em]
                text-[var(--surface-solid)]
                transition-all duration-300
                hover:bg-[var(--accent)]
                hover:-translate-y-[1px]
                flex justify-between items-center
              "
            >
              <span>{isLoading ? "AUTHENTICATING..." : "ENTER PLATFORM"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>

          </form>
          
          {onToggle && (
             <div className="mt-8">
               <button 
                 onClick={onToggle}
                 className="research-label text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
               >
                 REQUEST ACCESS →
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
