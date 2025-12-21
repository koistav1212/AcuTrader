"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../../lib/constants/nav";
import { cn } from "../../lib/utils";
import { useState, useRef, useEffect } from "react";

import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/UserContext";
import { Sun, Moon, User, Settings, LogOut } from "lucide-react";

export function DesktopNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur-sm hidden sm:block">
      <div className="container flex h-16 items-center justify-between mx-auto">

        {/* BRAND / LOGO */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="../../icon.png" alt="" className="h-8 w-8 flex items-center justify-center rounded-lg bg-transparent text-white font-bold"/>
          
          <span className="hidden sm:inline-block font-semibold text-lg tracking-tight text-[var(--text)]">
            AcuTrader
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors pb-1",
                  isActive
                    ? "text-[var(--accent)] font-semibold border-b-2 border-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE: THEME BUTTON + PROFILE */}
        <div className="flex items-center space-x-3">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)]/20 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-yellow-300" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--text)]" />
            )}
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border border-[var(--border)] rounded-full bg-[var(--card)] hover:bg-[var(--accent)]/10 transition-colors flex items-center justify-center focus:outline-none"
            >
              <div className="h-4 w-4 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px] text-white font-bold">
                 {user?.firstName ? user.firstName[0].toUpperCase() : <User size={12}/>}
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-[var(--border)]">
                   <p className="text-sm font-semibold text-[var(--text)] truncate">
                      {user?.firstName || 'User'} {user?.lastName || ''}
                   </p>
                   <p className="text-xs text-[var(--text-secondary)] truncate">
                      {user?.email || ''}
                   </p>
                </div>
                
                <div className="py-1">
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2 text-[var(--text-secondary)]" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
