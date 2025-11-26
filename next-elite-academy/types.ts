export type Page = 'home' | 'about' | 'courses' | 'course-details' | 'contact' | 'enroll' | 'blog' | 'blog-post';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of the correct option
}

export interface CoursePreview {
  type: 'video' | 'quiz' | 'document';
  title: string;
  description: string;
  videoUrl?: string; // For type 'video'
  documentUrl?: string; // For type 'document'
  quizData?: QuizQuestion[]; // For type 'quiz'
}

export interface Course {
  id: string;
  title: string;
  category: 'Logic' | 'Debate' | 'English' | 'AI';
  shortDescription: string;
  fullDescription: string;
  instructor: string;
  duration: string;
  level: 'Middle School' | 'High School' | 'All Levels';
  image: string;
  syllabus: string[];
  preview?: CoursePreview;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown string
  author: string;
  date: string;
  image: string;
  category: string;
}