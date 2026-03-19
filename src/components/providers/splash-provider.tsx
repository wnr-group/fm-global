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

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Check if this is first visit in session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("fm-splash-shown");
    if (hasVisited) {
      setShowSplash(false);
      setIsLoading(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("fm-splash-shown", "true");
  };

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
