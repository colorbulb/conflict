import React, { useState } from 'react';
import { Course } from '../types';
import { COURSES } from '../constants';
import { Search, Filter } from 'lucide-react';

interface CoursesProps {
  onViewCourse: (course: Course) => void;
}

export const Courses: React.FC<CoursesProps> = ({ onViewCourse }) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Logic', 'Debate', 'English', 'AI'];

  const filteredCourses = COURSES.filter(course => {
    const matchesCategory = filter === 'All' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Curriculum</h1>
          <p className="text-indigo-200">Explore our comprehensive range of courses designed for the modern student.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    filter === cat 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-full border border-slate-100">
                <div className="h-48 relative">
                   <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow">
                     {course.level}
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{course.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{course.shortDescription}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{course.duration}</span>
                    <button 
                      onClick={() => onViewCourse(course)}
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <Filter className="mx-auto mb-4 opacity-50" size={48} />
              <p>No courses found matching your criteria.</p>
              <button onClick={() => {setFilter('All'); setSearch('')}} className="mt-4 text-primary hover:underline">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
