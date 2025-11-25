// Enquiry Form Types
export interface EnquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  educationOrProfession: string;
  message: string;
  source: 'Instagram' | 'LinkedIn' | 'YouTube' | 'Other' | '';
}

// Database Types
export interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  education: string;
  message: string;
  source: string;
  created_at: string;
}

export interface EnquiryStatus {
  id: string;
  enquiry_id: string;
  status: 'new' | 'contacted' | 'interested' | 'not-interested' | 'converted';
  updated_at: string;
}

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
  isButton?: boolean;
  isExternal?: boolean;
}

// Component Types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CurriculumModule {
  id: string;
  title: string;
  duration: string;
  topics: string[];
  isExpanded?: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  description: string;
  image: string;
  linkedin?: string;
}
