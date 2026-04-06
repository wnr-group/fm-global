'use client';

import { useState, useCallback } from 'react';
import { Briefcase, RefreshCw } from 'lucide-react';
import type { JobListing } from '@/types/jobs';
import { JobCard } from './JobCard';
import { JobCardSkeleton } from './JobCardSkeleton';

interface CurrentOpeningsProps {
  initialJobs: JobListing[] | null;
  initialError: string | null;
}

export function CurrentOpenings({ initialJobs, initialError }: CurrentOpeningsProps) {
  const [jobs, setJobs] = useState<JobListing[] | null>(initialJobs);
  const [error, setError] = useState<string | null>(initialError);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async () => {
    setIsRetrying(true);
    setError(null);
    try {
      const res = await fetch('/api/placement/jobs');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setJobs(json.data);
    } catch {
      setError('Failed to load job listings. Please try again.');
    } finally {
      setIsRetrying(false);
    }
  }, []);

  const hasJobs = jobs && jobs.length > 0;

  return (
    <>
      <section
        id="current-openings"
        aria-labelledby="openings-heading"
        className="py-16 sm:py-20 lg:py-24 bg-secondary/30"
      >
        <div className="w-full px-5 sm:px-8 lg:px-[6%] xl:px-[8%]">
          {/* Header */}
          <header className="mb-12 lg:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Current Openings
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2
                id="openings-heading"
                className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-2xl leading-[1.1]"
              >
                Live job{" "}
                <span className="text-primary">opportunities</span>
              </h2>
              {hasJobs && (
                <p className="text-sm text-muted-foreground">
                  {jobs.length} opening{jobs.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
          </header>

          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-destructive/60" aria-hidden="true" />
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">{error}</p>
              <button
                onClick={retry}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
                {isRetrying ? 'Retrying…' : 'Try again'}
              </button>
            </div>
          )}

          {/* Skeleton (retrying) */}
          {!error && isRetrying && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!error && !isRetrying && !hasJobs && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-primary/40" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">No openings right now</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Check back soon — new positions are posted regularly.
              </p>
            </div>
          )}

          {/* Jobs grid */}
          {!error && !isRetrying && hasJobs && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
