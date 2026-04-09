'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Briefcase } from 'lucide-react';
import type { JobListing } from '@/types/jobs';
import { trackJobView } from '@/lib/analytics';

interface JobCardProps {
  job: JobListing;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/placement/jobs/${job.id}`}
      onClick={() => trackJobView(job.id, job.title, job.company)}
      className="group flex flex-col bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={`View details for ${job.title} at ${job.company}`}
    >
      {/* Image — show full poster if present */}
      {job.image_url ? (
        <div className="relative bg-secondary/20 overflow-hidden">
          <Image
            src={job.image_url}
            alt={`${job.title} at ${job.company}`}
            width={600}
            height={800}
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] bg-secondary/30 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/30" />
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg text-foreground truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{job.company}</p>
          </div>
          {job.salary_range && (
            <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
              {job.salary_range}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" aria-hidden="true" />
          <span className="truncate">{job.location}</span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all mt-auto">
          View Details
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
