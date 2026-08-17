"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider, useUser } from "./context/UserContext"; // Import UserProvider
import { LoginForm } from "@/components/auth/LoginForm";
import { DesktopNavbar } from "./components/layout/DekstopNavBar";
import { MobileBottomBar } from "./components/layout/MobileBottomBar";
import { Footer } from "./components/layout/Footer";

function LayoutContent({ children, isAuthPage }: { children: React.ReactNode, isAuthPage: boolean }) {
  const { user, loading } = useUser();

  let content = children;
  if (!isAuthPage && loading) {
    content = <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] animate-pulse">Loading...</div>;
  } else if (!isAuthPage && !user) {
    content = (
      <div className="flex-1 flex flex-col w-full">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contextual Nav/Footer: Hidden on Auth Page */}
      {!isAuthPage && <DesktopNavbar />}

      {/* Main content */}
      <main className={`flex-grow flex flex-col w-full max-w-full${isAuthPage ? ' h-screen p-0 overflow-x-hidden' : ''}`}>
        {content}
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileBottomBar />}
      {!isAuthPage && <div className="sm:hidden h-16" />}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]" suppressHydrationWarning>
        <ThemeProvider>
          <UserProvider>
            <LayoutContent isAuthPage={isAuthPage}>
              {children}
            </LayoutContent>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
