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
      <body className="font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider>
          <UserProvider>
            <div className="min-h-screen flex flex-col">
              
              {/* Contextual Nav/Footer: Hidden on Auth Page */}
              {!isAuthPage && <DesktopNavbar />}

              {/* Main content */}
              <main className={`flex-grow container mx-auto${isAuthPage ? 'h-screen p-0 max-w-none overflow-x-hidden' : ''}`}>
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
