import { supabase, isSupabaseConfigured } from '../services/supabase/client';
import type { EnquiryFormData } from '../types';

export const addNewEnquiry = async (formData: EnquiryFormData) => {
  if (!supabase || !isSupabaseConfigured) {
    console.error('Supabase is not configured. Please add credentials to .env.local');
    return {
      data: null,
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
    };
  }

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          education: formData.educationOrProfession,
          message: formData.message,
          source: formData.source,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding enquiry:', error);
    return { data: null, error };
  }
};

export const addEnquiryStatus = async (enquiryId: string, status: string = 'new') => {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('enquiry_status')
      .insert([
        {
          enquiry_id: enquiryId,
          status: status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding enquiry status:', error);
    return { data: null, error };
  }
};

export const submitEnquiry = async (formData: EnquiryFormData) => {
  // First, add the enquiry
  const { data: enquiryData, error: enquiryError } = await addNewEnquiry(formData);

  if (enquiryError || !enquiryData) {
    return { success: false, error: enquiryError };
  }

  // Then, add the initial status
  const { error: statusError } = await addEnquiryStatus(enquiryData.id, 'new');

  if (statusError) {
    return { success: false, error: statusError };
  }

  return { success: true, error: null };
};
