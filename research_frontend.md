# AcuTrader Frontend Architecture & Research Guide

Welcome to the comprehensive architecture and research guide for the **AcuTrader** Next.js project. This document serves as the ultimate map to understand the project's structure, core concepts, background tasks, and high-level logic, ensuring you have complete access and understanding of the codebase.

---

## 1. Project Overview & Aesthetic
**AcuTrader** is an AI-powered quantitative trading and equity research platform MVP. It is designed with a premium, cinematic, light-themed aesthetic (detailed in `story.md`) that merges institutional quantitative research with editorial storytelling. 

**Core Tech Stack:**
- **Framework:** Next.js 14 (App Router)
- **Frontend UI:** React 18, Tailwind CSS, Lucide React (Icons)
- **State Management & Fetching:** Zustand, React Query (@tanstack/react-query)
- **Data Visualization:** Recharts, Lightweight Charts, ECharts
- **Animations:** GSAP, Framer Motion, Anime.js
- **Database (Internal):** Mongoose (MongoDB)
- **Forms & Validation:** React Hook Form, Zod

---

## 2. High-Level Architectural Flow

The architecture follows a modern, client-heavy Next.js App Router pattern, tightly coupled with global providers and a clear separation between UI, state, and API layers.

### **The Request Lifecycle**
1. **Entry Point (`app/layout.tsx`):**
   - The user visits the app. The root layout wraps the application in essential providers: `ThemeProvider`, `UserProvider`, and `Providers` (which includes the React Query client).
   - **Auth Barrier:** `LayoutContent` checks if the user is authenticated via `useUser()`. If not (and they aren't on the root `/` page), it intercepts the render and displays the `<LoginForm />`.
2. **Navigation & Layout:**
   - Once authenticated, the user is presented with the `DesktopNavbar`, `MobileBottomBar`, and the main content area.
3. **Dashboard Workspace (`app/dashboard/page.tsx` & `DashboardContent.tsx`):**
   - The user lands on the dashboard. This is the central hub.
   - The UI makes use of custom hooks (e.g., `useDashboardOverview`, `useMarketQuote`) which internally rely on React Query to fetch data from the Next.js `app/api` routes or external endpoints.
4. **Data Layer (`app/api/` & `app/lib/db.ts`):**
   - API routes handle fetching market data and user portfolios.
   - `app/lib/db.ts` establishes a cached connection to MongoDB using Mongoose for internal user/portfolio storage.

---

## 3. Major Folders & Files Walkthrough

### `/app` (The Core Application)
- **`/layout.tsx` & `/page.tsx`:** The root layout (auth wall, providers) and the main entry page (often the login or landing page).
- **`/providers.tsx`:** Configures global providers, specifically the React Query client for data fetching.
- **`/dashboard/`:** The core authenticated workspace.
  - `page.tsx`: Manages the top-level tab state (Dashboard, Stocks, Portfolio, Profile) and mobile navigation.
  - `DashboardContent.tsx`: The complex trading workspace grid containing `TradingCommandBar`, `MarketOverview`, `SeasonalitySection`, `SymbolSearch`, etc.
- **`/api/`:** The Next.js backend API routes (e.g., `/api/market`).
- **`/context/`:** Global React contexts.
  - `ThemeContext.tsx`: Manages light/dark mode.
  - `UserContext.tsx`: Manages user authentication, profile, and basic holdings.
- **`/hooks/`:** Custom React hooks for data fetching and business logic (e.g., `useDashboardOverview`, `useMarketQuote`).
- **`/lib/`:** Utility functions, constants, and the MongoDB connection setup (`db.ts`).
- **`/models/`:** Mongoose schemas (e.g., `User.ts`) defining the data structure in MongoDB.
- **`/services/`:** Abstractions for backend operations (e.g., `portfolioService.ts`).

### `/components` (Reusable UI Elements)
- **`/auth/`:** Components like `LoginForm` and `OpenPlatformButton`.
- **`/dashboard/`:** The granular widgets of the trading workspace (e.g., `MarketTicker`, `KPIWidget`).
- **`/dashboard/workspace/` & `/dashboard/analytics/`:** Advanced widgets like `MarketMovers`, `SymbolSearch`, and AI `MarketIntelligence`.
- **`/layout/`:** `DesktopNavbar`, `MobileBottomBar`, `Footer`.

### `/scripts` (Background Tasks & Utilities)
- **`updateBackend.js`:** A Node.js script that patches and updates an *external* backend repository (AcuTrader-backend). It modifies caching logic, updates search algorithms in `MarketDataService.js`, and injects a script called `syncSymbolCatalog.js`.

---

## 4. Background Tasks & Processes

While Next.js acts as the primary frontend and lightweight API, the project interacts with background processes defined in the `/scripts` directory.

### **The Symbol Sync Process (`syncSymbolCatalog.js`)**
Injected into the backend via `updateBackend.js`, this process is responsible for keeping the market symbol catalog up to date.
- **Logic:** It iterates through a hardcoded list of major tickers (AAPL, MSFT, NVDA, etc.).
- **External Integration:** It calls the `yahoo-finance2` library to fetch the latest quotes.
- **Database (Prisma):** It normalizes the exchange names (converting `NasdaqGS` to `NASDAQ`) and upserts the active records into a PostgreSQL database using Prisma.
- **Purpose:** Ensures the search feature (`SymbolSearch`) has a fast, locally cached, and accurate list of symbols to query against before falling back to live providers.

---

## 5. Key Concepts & Logic

### **Simulated Trading & Portfolio Management**
- The app calculates Real-time PnL (Profit and Loss). In `DashboardContent.tsx`, positions are mapped from `holdings`, calculating `pnl` and `pnlPercent` based on average cost and simulated real-time quotes.
- The `TradingCommandBar` aggregates total account value, available cash, and day exposure.

### **AI Market Intelligence (Story & Concept)**
- As outlined in `story.md`, the platform conceptually ingest fragmented market noise (News, RSS, Fundamentals) and filters it through an **AI Pipeline**.
- **Semantic Filtering:** Conceptually utilizes models like `all-MiniLM-L6-v2` and `SentenceTransformers` to deduplicate and weight news.
- **Generative Synthesis:** Uses LLMs (conceptually `MISTRAL-7B-INSTRUCT` or similar) to generate structured Equity Research Notes.
- **Probability Engine:** Combines technicals, fundamentals, and sentiment to output quantitative trade scenarios (Bull vs Bear cases).

### **Cinematic Data Visualization**
- The project heavily emphasizes a premium visual experience. You will find extensive use of chart libraries and animation frameworks (GSAP/Framer Motion) to create smooth, scroll-driven narratives and dynamic market widgets (e.g., `MarketTicker` scrolling prices).

---

## 6. How to Navigate & Modify

1. **Changing UI Layouts:** Start in `app/dashboard/DashboardContent.tsx`. This is the skeleton of the main workspace grid.
2. **Modifying Data Fetching:** Look into `app/hooks/`. This is where React Query interacts with Next.js APIs. If you need to change the endpoint, modify the hook and the corresponding route in `app/api/`.
3. **Authentication Flow:** Check `app/layout.tsx` (the auth barrier) and `app/context/UserContext.tsx` (the state).
4. **Styling:** The project uses Tailwind CSS deeply coupled with custom CSS variables defined in `globals.css` (e.g., `var(--bg-primary)`, `var(--accent)`).

This document serves as your compass. You are now equipped to navigate, debug, and expand the AcuTrader frontend!
