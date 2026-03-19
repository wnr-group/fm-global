"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { SplashScreen } from "@/components/ui/splash-screen";
import { useVideoPreload } from "./video-preload-provider";

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
  const { isLoaded: videoLoaded, progress: videoProgress } = useVideoPreload();

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if this is first visit in session
  // BUT always show splash if video isn't loaded yet
  useEffect(() => {
    if (!mounted) return;

    const storage = safeSessionStorage();
    const hasVisited = storage?.getItem("fm-splash-shown");

    // Only skip splash if visited before AND video is already loaded
    if (hasVisited && videoLoaded) {
      setShowSplash(false);
      setIsLoading(false);
    }
  }, [mounted, videoLoaded]);

  const handleSplashComplete = () => {
    // Only complete if video is loaded
    if (!videoLoaded) return;

    setIsLoading(false);
    const storage = safeSessionStorage();
    storage?.setItem("fm-splash-shown", "true");
  };

  // Show splash screen during SSR/hydration to prevent flash
  if (!mounted) {
    return (
      <SplashContext.Provider value={{ isLoading: true }}>
        <SplashScreen
          minDuration={1500}
          waitForVideo={true}
          videoProgress={0}
        />
        <div className="opacity-0">{children}</div>
      </SplashContext.Provider>
    );
  }

  return (
    <SplashContext.Provider value={{ isLoading }}>
      {showSplash && isLoading && (
        <SplashScreen
          minDuration={1500}
          onComplete={handleSplashComplete}
          waitForVideo={!videoLoaded}
          videoProgress={videoProgress}
        />
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
