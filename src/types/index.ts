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

// Dashboard Types
export interface Enrollment {
  id: string;
  user_id: string;
  batch_id: string;
  is_free: boolean;
  status: 'active' | 'completed' | 'cancelled';
  enrolled_at: string;
  batch?: Batch;
}

export interface Batch {
  id: string;
  name: string;
  curriculum_version_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface CourseModule {
  id: string;
  curriculum_version_id: string;
  name: string;
  description: string;
  type: 'beginner' | 'advanced' | 'ai';
  display_order: number;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  module_id: string;
  name: string;
  description: string;
  display_order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  is_completed?: boolean;
  completed_at?: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface Session {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  session_type: 'beginner' | 'advanced' | 'ai';
  scheduled_at: string;
  duration_minutes: number;
  is_active: boolean;
  has_zoom_link?: boolean; // True if zoom link is available
}

export interface DashboardData {
  enrollment: Enrollment | null;
  modules: CourseModule[];
  progress: LessonProgress[];
  todaySession: Session | null;      // Session scheduled for today
  upcomingSession: Session | null;   // Next session after today
  stats: {
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
  };
}

// Blog Types
export type BlogCategory = 'DSA' | 'System Design' | 'AI' | 'Career' | 'Course Updates';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'DSA',
  'System Design',
  'AI',
  'Career',
  'Course Updates',
];

export interface EditorJSBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface EditorJSData {
  time?: number;
  blocks: EditorJSBlock[];
  version?: string;
}

// Tiptap JSON types
export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

export type BlogContent = EditorJSData | TiptapDoc;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContent;
  cover_image_url: string | null;
  category: BlogCategory;
  tags: string[];
  status: 'draft' | 'published';
  read_time_minutes: number;
  author_name: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: BlogContent;
  cover_image_url: string | null;
  category: BlogCategory;
  tags: string[];
  status: 'draft' | 'published';
}
