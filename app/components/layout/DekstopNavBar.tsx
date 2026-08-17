"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../../lib/constants/nav";
import { cn } from "../../lib/utils";
import { useUser } from "@/app/context/UserContext";

export function DesktopNavbar() {
  const pathname = usePathname();
  const { logout, user } = useUser();

  return (
    <header
      className="
        sticky top-0 z-40 hidden w-full sm:block
        border-b border-[var(--border-strong)]
        bg-[var(--bg-primary)]/95
        backdrop-blur-xl
        shadow-[0_6px_24px_rgba(28,32,38,0.04)]
      "
    >
      <div className="mx-auto flex h-[72px] items-center justify-between px-6 md:px-10">

        {/* LEFT SIDE */}
        <div className="flex h-full items-center gap-14">

          {/* BRAND */}
          <Link
            href="/"
            className="
              group flex items-center
              transition-opacity duration-200
              hover:opacity-75
            "
          >
            <span
              className="
                font-mono
                text-[13px]
                font-bold
                tracking-[0.22em]
                text-[var(--text-primary)]
              "
            >
              ACUTRADER
            </span>

            <span
              className="
                ml-3 h-1.5 w-1.5
                bg-[var(--signal-blue)]
                transition-transform duration-300
                group-hover:scale-125
              "
            />
          </Link>

          {/* NAVIGATION */}
          {user && (
            <nav className="flex h-full items-center gap-2">

              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (
                    pathname.startsWith(item.href) &&
                    item.href !== "/dashboard" &&
                    item.href !== "/"
                  );

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      `
                      group relative flex h-full items-center
                      px-4
                      font-mono
                      text-[11px]
                      tracking-[0.14em]
                      uppercase
                      transition-all duration-300
                      `,
                      isActive
                        ? `
                          font-extrabold
                          text-[#111827]
                        `
                        : `
                          font-semibold
                          text-[var(--text-secondary)]
                          hover:bg-black/[0.035]
                          hover:text-[#111827]
                        `
                    )}
                  >
                    {/* NAV TEXT */}
                    <span className="relative z-10">
                      {item.name}
                    </span>

                    {/* ACTIVE INDICATOR */}
                    <span
                      className={cn(
                        `
                        absolute bottom-0 left-1/2
                        h-[3px]
                        -translate-x-1/2
                        transition-all duration-300
                        `,
                        isActive
                          ? `
                            w-[calc(100%-20px)]
                            bg-[#111827]
                          `
                          : `
                            w-0
                            h-[2px]
                            bg-[var(--accent)]
                            group-hover:w-[calc(100%-28px)]
                          `
                      )}
                    />

                    {/* ACTIVE SIDE MARKER */}
                    {isActive && (
                      <span
                        className="
                          absolute left-1 top-1/2
                          h-1 w-1
                          -translate-y-1/2
                          bg-[var(--signal-blue)]
                        "
                      />
                    )}
                  </Link>
                );
              })}

            </nav>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            flex items-center gap-7
            font-mono
            text-[10px]
            tracking-[0.14em]
            uppercase
          "
        >
          {user && (
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-[var(--signal-green)]" />
                <span className="font-semibold text-[var(--text-primary)]">
                  {user.firstName || "USER"}
                </span>
              </div>

              <div className="h-4 w-px bg-[var(--border-strong)]" />

              <button
                onClick={() => logout()}
                className="
                  font-semibold
                  text-[var(--text-secondary)]
                  transition-all duration-200
                  hover:text-[var(--signal-red)]
                "
              >
                SIGN OUT
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}