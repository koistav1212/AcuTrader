"use client";

import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <span className="research-label !text-[var(--text-primary)] font-bold hover:opacity-80">
            ← RETURN TO PLATFORM
          </span>
        </Link>
      </div>

      {isLogin ? (
        <LoginForm onToggle={() => setIsLogin(false)} />
      ) : (
        <SignupForm onToggle={() => setIsLogin(true)} />
      )}
    </div>
  );
}
