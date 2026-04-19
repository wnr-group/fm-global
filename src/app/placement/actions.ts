'use server';

import { createClient } from '@/lib/supabase/server';
import type { JobListing } from '@/types/jobs';

export async function getActiveJobListings(): Promise<{ data: JobListing[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .select('id, title, company, location, description, requirements, salary_range, pdf_url, pdf_filename, image_url, image_filename, contact_type, contact_value, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(9);

    if (error) throw error;
    return { data: data as JobListing[], error: null };
  } catch (err) {
    console.error('Error fetching job listings:', err);
    return { data: null, error: 'Failed to fetch job listings' };
  }
}

export async function getJobListingById(
  id: string
): Promise<{ data: JobListing | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .select(
        'id, title, company, location, description, requirements, salary_range, pdf_url, pdf_filename, image_url, image_filename, contact_type, contact_value, is_active, created_at, updated_at'
      )
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return { data: data as JobListing, error: null };
  } catch (err) {
    console.error('Error fetching job listing by id:', err);
    return { data: null, error: 'Job listing not found' };
  }
}

export async function getPlacementCategories() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('placement_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}