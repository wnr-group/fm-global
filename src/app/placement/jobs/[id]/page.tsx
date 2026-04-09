import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getJobListingById } from '../../actions';
import JobDetailView from '@/components/placement/JobDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: job } = await getJobListingById(id);
  if (!job) return { title: 'Job Not Found' };
  return {
    title: `${job.title} at ${job.company} | FM Global Careers`,
    description: job.description ?? `${job.title} position at ${job.company} in ${job.location}`,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: job, error } = await getJobListingById(id);

  if (!job || error) notFound();

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || `${job.title} position at ${job.company}`,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: job.location,
    },
    ...(job.salary_range && { baseSalary: { "@type": "MonetaryAmount", value: job.salary_range } }),
    datePosted: job.created_at,
    employmentType: "FULL_TIME",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/placement"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0f385a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Placements
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0f385a] mb-2">{job.title}</h1>
              <p className="text-gray-500 text-base">
                {job.company}
                <span className="mx-2 text-gray-300">•</span>
                {job.location}
              </p>
              {job.salary_range && (
                <p className="mt-3 text-sm text-gray-400">{job.salary_range}</p>
              )}
            </div>
            <div className="shrink-0">
              <JobDetailView job={job} showApplyOnly />
            </div>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0f385a] mb-4">Job Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0f385a] mb-4">Requirements</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}

        {/* PDF Viewer */}
        {job.pdf_url && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6">
            <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0f385a]">Job Details (PDF)</h2>
              <JobDetailView job={job} showDownloadOnly />
            </div>
            <iframe
              src={job.pdf_url}
              className="w-full"
              style={{ height: '70vh', minHeight: '500px' }}
              title={`${job.title} - Job Details PDF`}
            />
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-800">Interested in this role?</p>
            <p className="text-sm text-gray-400">Contact {job.company} to apply.</p>
          </div>
          <JobDetailView job={job} showApplyOnly />
        </div>
      </div>
    </main>
  );
}
