import React from 'react';
import { Page, Course } from '../types';
import { COURSES, TESTIMONIALS } from '../constants';
import { ArrowRight, Brain, Mic, BookOpen, Cpu, CheckCircle } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page) => void;
  onViewCourse: (course: Course) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewCourse }) => {
  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center md:text-left md:flex items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Master the Skills of <br />
              <span className="text-accent">Tomorrow</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg">
              Empowering students with Critical Thinking, Eloquent Speech, and Artificial Intelligence mastery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => onNavigate('courses')}
                className="bg-accent text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition flex items-center justify-center gap-2"
              >
                Explore Courses <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-slate-900 transition"
              >
                About Us
              </button>
            </div>
          </div>
          <div className="hidden md:block md:w-5/12">
            <img 
              src="https://picsum.photos/600/600?random=20" 
              alt="Student learning" 
              className="rounded-2xl shadow-2xl border-4 border-white/20 transform rotate-3 hover:rotate-0 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features / Disciplines */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Disciplines</h2>
            <p className="text-slate-600">We provide a holistic educational approach that combines traditional humanities with cutting-edge technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition">
                <Brain size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Logic</h3>
              <p className="text-slate-600 text-sm">Sharpen analytical skills and learn to construct sound, irrefutable arguments.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition">
                <Mic size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Debate</h3>
              <p className="text-slate-600 text-sm">Gain confidence in public speaking and master the art of persuasion.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">English</h3>
              <p className="text-slate-600 text-sm">Advanced composition, literary analysis, and vocabulary development.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition">
                <Cpu size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI & Tech</h3>
              <p className="text-slate-600 text-sm">Understand the mechanics of AI, coding, and future ethics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Preview */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Courses</h2>
              <p className="text-slate-600">Join hundreds of students in our top-rated programs.</p>
            </div>
            <button 
              onClick={() => onNavigate('courses')}
              className="hidden md:flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="h-48 overflow-hidden">
                   <img src={course.image} alt={course.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded uppercase tracking-wider">{course.category}</span>
                    <span className="text-xs text-slate-500">{course.level}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 flex-1">{course.shortDescription}</p>
                  <button 
                    onClick={() => onViewCourse(course)}
                    className="w-full mt-auto border border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => onNavigate('courses')}
              className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium"
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                <div className="text-4xl text-indigo-200 absolute top-4 left-4 font-serif">"</div>
                <p className="text-slate-700 italic mb-6 relative z-10">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <span className="text-xs text-slate-500 uppercase">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Enrollment for the upcoming semester is now open. Secure your spot today and unlock your potential.
          </p>
          <button 
            onClick={() => onNavigate('enroll')}
            className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg"
          >
            Enroll Now
          </button>
        </div>
      </section>
    </div>
  );
};
