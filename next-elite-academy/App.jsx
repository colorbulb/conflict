import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './views/Home.jsx';
import { About } from './views/About.jsx';
import { Courses } from './views/Courses.jsx';
import { CourseDetails } from './views/CourseDetails.jsx';
import { Contact } from './views/Contact.jsx';
import { Enroll } from './views/Enroll.jsx';
import { Blog } from './views/Blog.jsx';
import { BlogPostView } from './views/BlogPost.jsx';
import { Admin } from './views/Admin.jsx';
import { 
  INITIAL_COURSES, 
  INITIAL_BLOG_POSTS, 
  INITIAL_SOCIAL_FEED, 
  INITIAL_SETTINGS,
  TEAM,
  TESTIMONIALS,
  INITIAL_PAGE_CONTENT
} from './constants.js';

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
    {/* Geometric Shapes */}
    <div className="absolute top-10 left-10 text-blue-200 animate-float-slow">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
    <div className="absolute top-1/4 right-20 text-indigo-100 animate-float-medium">
      <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
        <rect width="80" height="80" />
      </svg>
    </div>
    <div className="absolute bottom-1/3 left-1/4 text-amber-100 animate-float-slow delay-1000">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
        <polygon points="50,15 90,85 10,85" />
      </svg>
    </div>
    <div className="absolute bottom-20 right-1/3 text-blue-100 animate-float-fast">
      <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
    <div className="absolute top-1/2 left-10 text-indigo-50 animate-drift">
      <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
         <path d="M10 10 H 90 V 90 H 10 L 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

const App = () => {
  // --- Global State (CMS Store) ---
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [blogPosts, setBlogPosts] = useState(INITIAL_BLOG_POSTS);
  const [socialFeed, setSocialFeed] = useState(INITIAL_SOCIAL_FEED);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [pageContent, setPageContent] = useState(INITIAL_PAGE_CONTENT);
  const [team, setTeam] = useState(TEAM);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [leads, setLeads] = useState([]);

  // --- Navigation State ---
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'course-details') setSelectedCourseId(null);
    if (page !== 'blog-post') setSelectedPostId(null);
  };

  const handleViewCourse = (course) => {
    setSelectedCourseId(course.id);
    setCurrentPage('course-details');
  };

  const handleViewPost = (post) => {
    setSelectedPostId(post.id);
    setCurrentPage('blog-post');
  };

  const handleEnroll = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentPage('enroll');
  };

  // --- Data Management Functions (Passed to CMS) ---
  const addLead = (leadData) => {
    const newLead = { id: Date.now().toString(), date: new Date().toLocaleDateString(), ...leadData };
    setLeads([newLead, ...leads]);
  };

  const updateSettings = (newSettings) => setSettings(newSettings);
  const deleteCourse = (id) => setCourses(courses.filter(c => c.id !== id));
  const deleteBlogPost = (id) => setBlogPosts(blogPosts.filter(p => p.id !== id));
  
  const updatePageContent = (page, key, value) => {
    setPageContent({
      ...pageContent,
      [page]: {
        ...pageContent[page],
        [key]: value
      }
    });
  };

  const syncSocialMedia = () => {
    const newPost = {
      id: Date.now().toString(),
      type: 'instagram',
      image: `https://picsum.photos/400/400?random=${Date.now()}`,
      caption: 'Synced content from Instagram API... #LiveUpdate',
      likes: 0
    };
    setSocialFeed([newPost, ...socialFeed]);
  };

  // --- Routing Logic ---
  const renderPage = () => {
    if (currentPage === 'admin') {
      return (
        <Admin 
          courses={courses}
          blogPosts={blogPosts}
          leads={leads}
          settings={settings}
          pageContent={pageContent}
          team={team}
          testimonials={testimonials}
          onUpdateSettings={updateSettings}
          onDeleteCourse={deleteCourse}
          onDeletePost={deleteBlogPost}
          onSyncSocial={syncSocialMedia}
          onUpdatePageContent={updatePageContent}
          onUpdateTeam={setTeam}
          onUpdateTestimonials={setTestimonials}
          onExit={() => handleNavigate('home')}
        />
      );
    }

    // Public Pages
    switch (currentPage) {
      case 'home':
        return <Home 
          onNavigate={handleNavigate} 
          onViewCourse={handleViewCourse} 
          courses={courses} 
          content={pageContent.home}
          testimonials={testimonials}
        />;
      case 'about':
        return <About 
          content={pageContent.about} 
          team={team} 
        />;
      case 'courses':
        return <Courses onViewCourse={handleViewCourse} courses={courses} />;
      case 'course-details':
        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) return <Courses onViewCourse={handleViewCourse} courses={courses} />;
        return <CourseDetails course={course} onNavigate={handleNavigate} onEnroll={handleEnroll} />;
      case 'blog':
        return <Blog onViewPost={handleViewPost} posts={blogPosts} socialFeed={socialFeed} />;
      case 'blog-post':
        const post = blogPosts.find(p => p.id === selectedPostId);
        if (!post) return <Blog onViewPost={handleViewPost} posts={blogPosts} socialFeed={socialFeed} />;
        return <BlogPostView post={post} onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onSubmitLead={addLead} settings={settings} content={pageContent.contact} />;
      case 'enroll':
        return <Enroll preselectedCourseId={selectedCourseId} onSubmitLead={addLead} courses={courses} />;
      default:
        return <Home onNavigate={handleNavigate} onViewCourse={handleViewCourse} courses={courses} content={pageContent.home} testimonials={testimonials} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-surface relative">
      {/* Background Animation Layer */}
      {currentPage !== 'admin' && <AnimatedBackground />}

      {currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          settings={settings}
        />
      )}
      
      <main className="flex-grow flex flex-col items-center justify-start w-full z-10">
        {renderPage()}
      </main>

      {currentPage !== 'admin' && (
        <Footer 
          onNavigate={handleNavigate} 
          settings={settings}
        />
      )}
    </div>
  );
};

export default App;
