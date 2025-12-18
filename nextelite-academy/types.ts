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
  ageGroup: string;
  description: string;
  fullDescription?: string; // Detailed description for the page
  icon: React.ReactNode;
  color: string;
  outline: string[];
  attachments: Attachment[];
  galleryImages?: string[]; // Specific images for this course
  quiz?: Quiz; // Optional quiz module
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
  author: string;
  tags: string[];
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
  galleryImages: string[];
  backgrounds?: {
    hero?: string;
    programs?: string;
    mentors?: string;
    gallery?: string;
    contact?: string;
  };
}

export interface AppData {
  courses: Course[];
  instructors: Instructor[];
  blogPosts: BlogPost[];
  themeColors: ThemeColors;
  trialSettings: TrialSettings;
  submissions: Submission[];
  pageContent?: PageContent;
}