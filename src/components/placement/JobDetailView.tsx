'use client';

import { Download, Mail, MessageCircle, Phone } from 'lucide-react';
import type { JobListing } from '@/types/jobs';

interface JobDetailViewProps {
  job: JobListing;
  showApplyOnly?: boolean;
  showDownloadOnly?: boolean;
}

export default function JobDetailView({
  job,
  showApplyOnly = false,
  showDownloadOnly = false,
}: JobDetailViewProps) {
  const getApplyHref = () => {
    const encodedTitle = encodeURIComponent(job.title);
    switch (job.contact_type) {
      case 'email':
        return `mailto:${job.contact_value}?subject=Application for ${encodedTitle}`;
      case 'whatsapp':
        return `https://wa.me/${job.contact_value.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I am interested in the ${job.title} position at ${job.company}.`)}`;
      case 'phone':
        return `tel:${job.contact_value}`;
    }
  };

  const getApplyLabel = () => {
    switch (job.contact_type) {
      case 'email':    return 'Apply via Email';
      case 'whatsapp': return 'Apply via WhatsApp';
      case 'phone':    return 'Call to Apply';
    }
  };

  const ApplyIcon = (() => {
    switch (job.contact_type) {
      case 'email':    return Mail;
      case 'whatsapp': return MessageCircle;
      case 'phone':    return Phone;
    }
  })();

  if (showDownloadOnly && job.pdf_url) {
    return (
      <a
        href={job.pdf_url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </a>
    );
  }

  if (showApplyOnly) {
    return (
      <a
        href={getApplyHref()}
        target={job.contact_type !== 'phone' ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-3 bg-[#0f385a] text-white rounded-lg text-sm font-semibold hover:bg-[#0f385a]/90 transition-colors"
      >
        <ApplyIcon className="w-4 h-4" aria-hidden="true" />
        {getApplyLabel()} →
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {job.pdf_url && (
        <a
          href={job.pdf_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      )}
      <a
        href={getApplyHref()}
        target={job.contact_type !== 'phone' ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2 bg-[#0f385a] text-white rounded-lg text-sm font-medium hover:bg-[#0f385a]/90 transition-colors"
      >
        <ApplyIcon className="w-4 h-4" aria-hidden="true" />
        {getApplyLabel()} →
      </a>
    </div>
  );
}
