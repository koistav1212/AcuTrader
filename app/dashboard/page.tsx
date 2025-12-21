"use client";

import React, { useState } from "react";

import { NAV_ITEMS } from "../lib/constants/nav";
import { cn } from "../lib/utils";

import DashboardSection from "./DashboardContent";
import MarketSection from "../stocks/page";
import ProfileSection from "../profile/page";
import PortfolioSection from "../portfolio/page";

import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

type Tab = "dashboard" | "stocks" | "portfolio" | "profile";

/* -----------------------------------------------------
   NAVBAR (MOBILE)
----------------------------------------------------- */

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onMenuToggle,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-secondary)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* LOGO + BRAND */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white font-bold">
            AT
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              AcuTrader
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Your Virtual Trading Floor
            </p>
          </div>
        </div>

        {/* Right side buttons: theme toggle + menu */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)]/20 transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-[var(--text)]" />
            )}
          </button>

          {/* MOBILE MENU */}
          <button
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] hover:bg-[var(--accent)]/20"
            aria-label="Open navigation menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

/* -----------------------------------------------------
   MOBILE MENU DRAWER
----------------------------------------------------- */

interface MobileMenuProps {
  isOpen: boolean;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
}) => {
  if (!isOpen) return null;

  const itemBase =
    "w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors";
  const itemActive = "bg-[var(--accent)] text-white";
  const itemInactive = "text-[var(--text)] hover:bg-[var(--accent)]/20";

  return (
    <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden">
      <div className="absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-[var(--bg-secondary)] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <p className="text-sm font-semibold text-[var(--text)]">Navigation</p>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text)] hover:bg-[var(--accent)]/20"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="space-y-2 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const tabName = item.href.substring(1) as Tab;
            return (
              <button
                key={item.href}
                className={cn(itemBase, activeTab === tabName ? itemActive : itemInactive)}
                onClick={() => {
                  onTabChange(tabName);
                  onClose();
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------
   FOOTER
----------------------------------------------------- */

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] lg:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[0.75rem] text-[var(--text-secondary)]">
        AcuTrader MVP
      </div>
    </footer>
  );
};

/* -----------------------------------------------------
   MAIN PAGE
----------------------------------------------------- */

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const header = {
    dashboard: {
      title: "Portfolio Dashboard",
      description: "Monitor your performance, balance, and asset allocation.",
    },
    stocks: {
      title: "Stock Market",
      description: "Browse stocks and execute simulated Buy/Sell orders.",
    },
    portfolio: {
      title: "My Holdings",
      description: "Review investments, average costs, and P/L.",
    },
    profile: {
      title: "User Profile",
      description: "Manage settings and preferences.",
    },
  }[activeTab];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)] pb-16 lg:pb-0">

      {/* NAV + MENU */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuToggle={() => setIsMenuOpen(true)}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-6 lg:px-6 lg:pt-8 lg:mt-0 mt-16">
        <div className="mb-5">
          <h1 className="text-xl font-semibold sm:text-2xl text-[var(--text)]">
            {header.title}
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {header.description}
          </p>
        </div>

        {/* Dynamic Sections */}
        {activeTab === "dashboard" && <DashboardSection />}
        {activeTab === "stocks" && <MarketSection />}
        {activeTab === "portfolio" && <PortfolioSection />}
        {activeTab === "profile" && <ProfileSection />}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
