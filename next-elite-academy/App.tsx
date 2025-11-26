import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { About } from './views/About';
import { Courses } from './views/Courses';
import { CourseDetails } from './views/CourseDetails';
import { Contact } from './views/Contact';
import { Enroll } from './views/Enroll';
import { Blog } from './views/Blog';
import { BlogPostView } from './views/BlogPost';
import { Page, Course, BlogPost } from './types';
import { COURSES, BLOG_POSTS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'course-details') setSelectedCourseId(null);
    if (page !== 'blog-post') setSelectedPostId(null);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setCurrentPage('course-details');
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPostId(post.id);
    setCurrentPage('blog-post');
  };

  const handleEnroll = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('enroll');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onViewCourse={handleViewCourse} />;
      case 'about':
        return <About />;
      case 'courses':
        return <Courses onViewCourse={handleViewCourse} />;
      case 'course-details':
        const course = COURSES.find(c => c.id === selectedCourseId);
        if (!course) return <Courses onViewCourse={handleViewCourse} />;
        return <CourseDetails course={course} onNavigate={handleNavigate} onEnroll={handleEnroll} />;
      case 'blog':
        return <Blog onViewPost={handleViewPost} />;
      case 'blog-post':
        const post = BLOG_POSTS.find(p => p.id === selectedPostId);
        if (!post) return <Blog onViewPost={handleViewPost} />;
        return <BlogPostView post={post} onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'enroll':
        return <Enroll preselectedCourseId={selectedCourseId} />;
      default:
        return <Home onNavigate={handleNavigate} onViewCourse={handleViewCourse} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow flex flex-col items-center justify-start w-full">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;