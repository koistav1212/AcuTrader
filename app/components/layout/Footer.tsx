"use client";

import Link from "next/link";
import { NAV_ITEMS } from "../../lib/constants/nav";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Icon */}
        <div className="flex items-center space-x-3">
          <img src="/main_icon.png" alt="AcuTrader" className="h-10 w-10 object-contain rounded-lg" />
          <span className="text-xl font-bold tracking-tight text-[var(--text)]">
            AcuTrader
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-6 justify-center">
            {NAV_ITEMS.map((item) => (
                <Link 
                    key={item.name} 
                    href={item.href}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                    {item.name}
                </Link>
            ))}
        </div>

        {/* Developer Info */}
        <div className="text-center md:text-right">
          <p className="text-sm text-[var(--text-secondary)]">
            Developed by <span className="font-semibold text-[var(--text)]">Koustav Sarkar</span>
          </p>
          <div className="flex gap-4 justify-center md:justify-end mt-2 text-xs font-medium text-[var(--accent)]">
            <Link href="https://linkedin.com/in/koustavsarkar" target="_blank" className="hover:underline">LinkedIn</Link>
            <Link href="#" className="hover:underline">Portfolio</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
