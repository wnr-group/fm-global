'use client';

import { useEffect, useCallback } from 'react';
import { X, MapPin, FileText, Mail, Phone, MessageCircle, Download } from 'lucide-react';
import type { JobListing } from '@/types/jobs';
import { trackJobApply, trackJobPDFDownload } from '@/lib/analytics';

interface JobModalProps {
  job: JobListing | null;
  onClose: () => void;
}

export function JobModal({ job, onClose }: JobModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!job) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [job, handleKeyDown]);

  if (!job) return null;

  const getApplyHref = () => {
    switch (job.contact_type) {
      case 'email':
        return `mailto:${job.contact_value}?subject=Application for ${encodeURIComponent(job.title)}`;
      case 'whatsapp':
        return `https://wa.me/${job.contact_value.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I am interested in the ${job.title} position at ${job.company}.`)}`;
      case 'phone':
        return `tel:${job.contact_value}`;
    }
  };

  const getApplyLabel = () => {
    switch (job.contact_type) {
      case 'email': return 'Apply via Email';
      case 'whatsapp': return 'Apply via WhatsApp';
      case 'phone': return 'Call to Apply';
    }
  };

  const ApplyIcon = (() => {
    switch (job.contact_type) {
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'phone': return Phone;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border border-border flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border sticky top-0 bg-background rounded-t-2xl">
          <div className="min-w-0">
            <h2
              id="job-modal-title"
              className="font-display text-2xl text-foreground leading-tight mb-1"
            >
              {job.title}
            </h2>
            <p className="text-base text-muted-foreground">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Close job details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary/60" aria-hidden="true" />
              {job.location}
            </span>
            {job.salary_range && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {job.salary_range}
              </span>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="font-display text-base text-foreground mb-2">About the Role</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="font-display text-base text-foreground mb-2">Requirements</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          )}

          {/* PDF */}
          {job.pdf_url && (
            <div>
              <h3 className="font-display text-base text-foreground mb-3">Job Description Document</h3>
              <a
                href={job.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                {job.pdf_filename ?? 'View PDF'}
              </a>
              <div className="mt-3 rounded-xl overflow-hidden border border-border aspect-[3/4] w-full">
                <iframe
                  src={`${job.pdf_url}#toolbar=0`}
                  title={`${job.title} job description PDF`}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 md:static px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-white z-10">
          {/* LEFT: Download PDF — only when pdf_url exists */}
          {job.pdf_url && (
            <a
              href={job.pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackJobPDFDownload(job.id, job.title, job.company)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}

          {/* RIGHT: Apply CTA — always shown, ml-auto pushes it right */}
          <a
            href={getApplyHref()}
            target={job.contact_type !== 'phone' ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={() => trackJobApply(job.id, job.title, job.company, job.contact_type)}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-[#0f385a] text-white rounded-lg text-sm font-medium hover:bg-[#0f385a]/90 transition-colors"
          >
            <ApplyIcon className="w-4 h-4" aria-hidden="true" />
            {getApplyLabel()} →
          </a>
        </div>
      </div>
    </div>
  );
}
