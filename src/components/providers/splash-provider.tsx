"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { SplashScreen } from "@/components/ui/splash-screen";

interface SplashContextType {
  isLoading: boolean;
}

const SplashContext = createContext<SplashContextType>({ isLoading: true });

export function useSplash() {
  return useContext(SplashContext);
}

// Safe storage access - handles private browsing, SSR, and quota errors
function safeSessionStorage() {
  try {
    if (typeof window === "undefined") return null;
    const testKey = "__storage_test__";
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return sessionStorage;
  } catch {
    return null;
  }
}

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if this is first visit in session
  useEffect(() => {
    if (!mounted) return;

    const storage = safeSessionStorage();
    const hasVisited = storage?.getItem("fm-splash-shown");

    if (hasVisited) {
      setShowSplash(false);
      setIsLoading(false);
    }
  }, [mounted]);

  const handleSplashComplete = () => {
    setIsLoading(false);
    const storage = safeSessionStorage();
    storage?.setItem("fm-splash-shown", "true");
  };

  // CRITICAL: On first render (server + client first pass), render children
  // with NO wrapper element. Server HTML has no SplashProvider DOM nodes,
  // so client must also produce none — they will match.
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SplashContext.Provider value={{ isLoading }}>
      {showSplash && isLoading && (
        <SplashScreen minDuration={2000} onComplete={handleSplashComplete} />
      )}
      <div
        className={`transition-opacity duration-300 ${
          showSplash && isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </SplashContext.Provider>
  );
}
