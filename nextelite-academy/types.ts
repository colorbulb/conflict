import React from 'react';

export type Language = 'en' | 'zh';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Attachment {
  name: string;
  size: string;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  ageGroup: string[]; // Multiple age groups
  category: string;
  // Difficulty levels for this course (e.g. Beginner, Intermediate)
  difficulty?: string[];
  description: string;
  fullDescription?: string; // Detailed description for the page (HTML)
  icon: React.ReactNode;
  color: string;
  outline: string[];
  attachments: Attachment[];
  galleryImages?: string[]; // Specific images for this course
  quiz?: Quiz; // Optional quiz module
  headerBackgroundImage?: string; // Background image for course detail header
  headerBackgroundOpacity?: number; // Opacity for background (default 0.2)
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML content
  date: string; // ISO Date string
  coverImage: string;
  tags: string[];
  category?: string; // Blog category from lookup list
  layoutBlocks?: Array<{
    id: string;
    type: 'text-image' | 'text-only' | 'image-text' | 'image-carousel';
    text: string;
    imageUrl?: string;
    images?: string[];
  }>; // Optional layout blocks for advanced layouts
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Section {
  HOME = 'home',
  COURSES = 'courses',
  BLOG = 'blog',
  INSTRUCTORS = 'instructors',
  GALLERY = 'gallery',
  CONTACT = 'contact',
  ABOUT = 'about',
}

export interface ThemeColors {
  yellow: string;
  orange: string;
  blue: string;
  green: string;
  purple: string;
}

export interface TrialSettings {
  enabled: boolean;
  slotsAvailable: number;
  message: string;
  blockedDates: string[]; // ISO Date strings (YYYY-MM-DD)
  customAvailability?: Record<string, string[]>; // Map 'YYYY-MM-DD' to array of time strings
}

export interface Submission {
  id: string;
  type: 'contact' | 'trial';
  name: string;
  contactInfo: string; // Email or Phone
  details: string; // Message content or "Grade 5 - [Date] [Time]"
  courseInterest?: string;
  timestamp: Date;
  status: 'new' | 'read';
}

export interface PageContent {
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    exploreButton: string;
    trialButton: string;
  };
  sections: {
    programs: {
      heading: string;
      subheading: string;
    };
    mentors: {
      heading: string;
      subheading: string;
    };
    gallery: {
      heading: string;
    };
    contact: {
      heading: string;
      subheading: string;
      address: string;
      email: string;
    };
  };
  about?: {
    heading: string;
    subheading: string;
    content: string; // HTML content
    imageUrl?: string;
    layoutBlocks?: Array<{
      id: string;
      type: 'text-image' | 'text-only' | 'image-text' | 'image-carousel';
      text: string;
      imageUrl?: string;
      images?: string[];
    }>; // Optional layout blocks for advanced layouts
  };
  galleryImages: string[];
  backgrounds?: {
    hero?: string;
    programs?: string;
    mentors?: string;
    gallery?: string;
    contact?: string;
    about?: string;
  };
  backgroundSizing?: {
    hero?: 'default' | 'width' | 'height';
    programs?: 'default' | 'width' | 'height';
    mentors?: 'default' | 'width' | 'height';
    gallery?: 'default' | 'width' | 'height';
    contact?: 'default' | 'width' | 'height';
    about?: 'default' | 'width' | 'height';
  };
  logo?: string;
}

export interface CustomPageTranslation {
  name: string;
  content: string;
  layoutBlocks?: Array<{
    id: string;
    type: 'text-image' | 'text-only' | 'image-text' | 'image-carousel';
    text: string;
    imageUrl?: string;
    images?: string[];
  }>;
}

export interface CustomPage {
  id: string;
  slug: string; // URL slug (e.g., 'our-story', 'services')
  translations: {
    en: CustomPageTranslation;
    zh: CustomPageTranslation;
  };
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface MenuItem {
  id: string;
  label: string; // Display text
  type: 'page' | 'link' | 'custom'; // 'page' = CustomPage slug, 'link' = external URL, 'custom' = predefined route
  target: string; // slug, URL, or route path
  order: number; // Display order
  visible: boolean; // Show/hide in menu
  parentId?: string; // For submenus - ID of parent menu item
  children?: MenuItem[]; // Submenu items (computed/optional)
}

export interface LookupLists {
  ageGroups: string[];
  courseCategories: string[];
  blogCategories: string[];
  difficulties: string[];
}

export interface AppData {
  courses: Course[];
  instructors: Instructor[];
  blogPosts: BlogPost[];
  themeColors: ThemeColors;
  trialSettings: TrialSettings;
  submissions: Submission[];
  pageContent?: PageContent;
  lookupLists?: LookupLists;
  customPages?: CustomPage[];
  menuItems?: MenuItem[];
}