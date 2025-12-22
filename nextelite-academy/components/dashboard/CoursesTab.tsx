import React, { useState } from 'react';
import { Course } from '../../types';
import { Plus, Edit } from 'lucide-react';

interface CoursesTabProps {
  courses: Course[];
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] };
  onUpdateCourse: (course: Course) => void;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ courses, lookupLists, onUpdateCourse }) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Course',
      description: '',
      ageGroup: [],
      color: 'bg-brand-blue',
      icon: '📚',
      features: [],
      price: 0,
      duration: '',
      category: lookupLists.courseCategories?.[0] || 'General',
      imageUrl: ''
    };
    setEditingCourse(newCourse);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
        <button
          onClick={handleAddCourse}
          className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-2 h-full ${course.color}`}></div>
            <div className="flex justify-between items-start mb-4 pl-4">
              <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
              <button
                onClick={() => setEditingCourse(course)}
                className="text-gray-400 hover:text-brand-blue bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm line-clamp-3 mb-4 pl-4">{course.description}</p>
            <div className="pl-4 pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              {Array.isArray(course.ageGroup) ? course.ageGroup.join(', ') : course.ageGroup}
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-gray-400 mb-4">No courses yet</p>
          <button
            onClick={handleAddCourse}
            className="text-brand-blue hover:text-brand-purple font-bold"
          >
            Create your first course
          </button>
        </div>
      )}

      {/* TODO: Add course editor modal when editingCourse is not null */}
      {/* You'll need to extract the course editor from the old CMSDashboard.tsx */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6">
                {courses.find(c => c.id === editingCourse.id) ? 'Edit' : 'New'} Course
              </h3>
              <p className="text-gray-500 mb-4">
                Extract full course editor from old CMSDashboard.tsx
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingCourse(null)}
                  className="px-6 py-2 rounded-full border border-gray-300 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateCourse(editingCourse);
                    setEditingCourse(null);
                  }}
                  className="px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600"
                >
                  Save Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
