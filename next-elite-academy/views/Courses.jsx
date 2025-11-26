import React, { useState } from 'react';
import { Search, Filter, Clock, BarChart } from 'lucide-react';

export const Courses = ({ onViewCourse, courses }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Logic', 'Debate', 'English', 'AI'];

  // Safe check for courses in case it's undefined initially
  const courseList = courses || [];

  const filteredCourses = courseList.filter(course => {
    const matchesCategory = filter === 'All' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-20">
      <div className="bg-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Course Catalog</h1>
          <p className="text-slate-400 text-lg max-w-2xl">Browse our specialized curriculum designed to challenge and inspire.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    filter === cat 
                      ? 'bg-primary text-white shadow-md transform scale-105' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by keyword..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-slate-200 group overflow-hidden">
                <div className="h-52 relative overflow-hidden">
                   <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition z-10"></div>
                   <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                   <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-slate-900 shadow z-20">
                     {course.category}
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{course.shortDescription}</p>
                  
                  <div className="mt-auto flex items-center gap-4 text-xs text-slate-500 font-medium border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BarChart size={14} /> {course.level}</span>
                  </div>
                  
                  <button 
                    onClick={() => onViewCourse(course)}
                    className="w-full mt-4 py-3 bg-slate-50 text-slate-900 font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <Filter className="mx-auto mb-4 opacity-50" size={48} />
              <p className="text-lg">No courses found matching criteria.</p>
              <button onClick={() => {setFilter('All'); setSearch('')}} className="mt-4 text-primary font-bold hover:underline">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};