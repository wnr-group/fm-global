"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface VideoPreloadContextType {
  videoUrl: string | null;
  isLoaded: boolean;
  progress: number;
  error: boolean;
}

const VideoPreloadContext = createContext<VideoPreloadContextType>({
  videoUrl: null,
  isLoaded: false,
  progress: 0,
  error: false,
});

export function useVideoPreload() {
  return useContext(VideoPreloadContext);
}

interface VideoPreloadProviderProps {
  children: ReactNode;
  videoSrc: string;
}

export function VideoPreloadProvider({ children, videoSrc }: VideoPreloadProviderProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let blobUrl: string | null = null;

    async function preloadVideo() {
      try {
        const response = await fetch(videoSrc);

        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        if (!response.body) {
          // Fallback: no streaming support, just get the blob directly
          const blob = await response.blob();
          blobUrl = URL.createObjectURL(blob);
          setVideoUrl(blobUrl);
          setProgress(100);
          setIsLoaded(true);
          return;
        }

        // Stream the response to track progress
        const reader = response.body.getReader();
        const chunks: BlobPart[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          received += value.length;

          if (total > 0) {
            setProgress(Math.round((received / total) * 100));
          }
        }

        // Combine chunks into a single blob
        const blob = new Blob(chunks, { type: "video/mp4" });
        blobUrl = URL.createObjectURL(blob);
        setVideoUrl(blobUrl);
        setProgress(100);
        setIsLoaded(true);
      } catch (err) {
        console.error("Video preload failed:", err);
        setError(true);
        // Fallback to original source on error
        setVideoUrl(videoSrc);
        setIsLoaded(true);
      }
    }

    preloadVideo();

    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [videoSrc]);

  return (
    <VideoPreloadContext.Provider value={{ videoUrl, isLoaded, progress, error }}>
      {children}
    </VideoPreloadContext.Provider>
  );
}
