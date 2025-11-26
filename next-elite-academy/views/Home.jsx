import React from 'react';
import { ArrowRight, Brain, Mic, BookOpen, Cpu, Star } from 'lucide-react';

export const Home = ({ onNavigate, onViewCourse, courses, content, testimonials }) => {
  const featuredCourses = courses ? courses.slice(0, 3) : [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-secondary text-white py-24 md:py-36 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        {/* Energetic AI GIF Animation Placeholder */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen">
             <img 
               src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm9ibHh3aDZ6cHRqemx3aDZ6cHRqemx3aDZ6cHRqemx3aDZ6cHRqemx3aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6HC/giphy.gif" 
               alt="Energetic AI Background" 
               className="w-full h-full object-cover"
             />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              Elite Education for Future Leaders
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 whitespace-pre-line">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('courses')}
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
              >
                {content.ctaButton} <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="px-8 py-4 rounded-lg font-bold text-white border border-slate-700 hover:bg-slate-800 transition"
              >
                {content.methodologyButton}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Credibility Strip */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 relative z-20">
        <div className="container mx-auto px-4 flex flex-wrap justify-around items-center gap-8 text-center md:text-left">
          <div>
            <p className="text-3xl font-bold text-white">{content.stats1}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{content.stats1Label}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{content.stats2}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{content.stats2Label}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{content.stats3}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{content.stats3Label}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{content.stats4}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{content.stats4Label}</p>
          </div>
        </div>
      </div>

      {/* Disciplines Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content.disciplinesTitle}</h2>
              <p className="text-slate-600 text-lg">{content.disciplinesText}</p>
            </div>
            <button onClick={() => onNavigate('courses')} className="hidden md:flex items-center text-primary font-bold hover:underline mt-4 md:mt-0">
              View All Courses <ArrowRight size={16} className="ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'Formal Logic', desc: 'Construct valid arguments and identify complex fallacies.' },
              { icon: Mic, title: 'Debate', desc: 'Public speaking, persuasion, and rapid critical analysis.' },
              { icon: BookOpen, title: 'Advanced English', desc: 'University-level reading, writing, and rhetorical analysis.' },
              { icon: Cpu, title: 'AI & Code', desc: 'Understanding the mechanics and ethics of Artificial Intelligence.' }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-blue-900/5 transition duration-300">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">{content.featuredTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                    {course.level}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2">{course.category}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{course.title}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-3">{course.shortDescription}</p>
                  <button 
                    onClick={() => onViewCourse(course)}
                    className="mt-auto w-full py-3 rounded-lg border-2 border-slate-100 font-bold text-slate-700 hover:border-primary hover:text-primary transition"
                  >
                    View Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.testimonialsTitle}</h2>
            <div className="flex justify-center gap-1 text-accent">
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-slate-800/50 p-10 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <p className="text-lg text-slate-300 italic mb-8 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <span className="text-sm text-slate-400 uppercase tracking-wider">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{content.ctaTitle}</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            {content.ctaText}
          </p>
          <button 
            onClick={() => onNavigate('enroll')}
            className="bg-white text-primary px-12 py-5 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-2xl hover:scale-105 transform duration-200"
          >
            Start Application
          </button>
        </div>
      </section>
    </div>
  );
};
