import { createClient } from '@/lib/supabase/server';
import type { JobListing } from '@/types/jobs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .select('id, title, company, location, description, requirements, salary_range, pdf_url, pdf_filename, image_url, image_filename, contact_type, contact_value, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(9);

    if (error) throw error;
    return NextResponse.json({ data: data as JobListing[], error: null });
  } catch (err) {
    console.error('Error fetching job listings:', err);
    return NextResponse.json({ data: null, error: 'Failed to fetch job listings' }, { status: 500 });
  }
}
