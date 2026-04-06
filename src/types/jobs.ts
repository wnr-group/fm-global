export type ContactType = 'email' | 'whatsapp' | 'phone';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string | null;
  requirements: string | null;
  salary_range: string | null;
  pdf_url: string | null;
  pdf_filename: string | null;
  contact_type: ContactType;
  contact_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type JobListingInsert = Omit<JobListing, 'id' | 'created_at' | 'updated_at'>;
export type JobListingUpdate = Partial<JobListingInsert>;
