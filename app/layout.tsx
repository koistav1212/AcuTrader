"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import { DesktopNavbar } from "./components/layout/DekstopNavBar";
import { MobileBottomBar } from "./components/layout/MobileBottomBar";
import { Footer } from "./components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UserProvider>
            <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
              
              {/* Contextual Nav/Footer: Hidden on Auth Page */}
              {!isAuthPage && <DesktopNavbar />}

              {/* Main content */}
              <main className={`flex-grow container mx-auto p-4 ${isAuthPage ? 'h-screen p-0 max-w-none' : ''}`}>
                {children}
              </main>

              {!isAuthPage && <Footer />}
              {!isAuthPage && <MobileBottomBar />}
              {!isAuthPage && <div className="sm:hidden h-16" />}
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
