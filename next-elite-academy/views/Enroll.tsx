import React, { useState } from 'react';
import { COURSES } from '../constants';

interface EnrollProps {
  preselectedCourseId: string | null;
}

export const Enroll: React.FC<EnrollProps> = ({ preselectedCourseId }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    gradeLevel: 'Middle School',
    courseId: preselectedCourseId || '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Enrollment</h1>
          <p className="text-slate-600">Join Nexus Academy today. Please fill out the form below to begin the registration process.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Application Received!</h2>
              <p className="text-slate-600 mb-8">
                Thank you for enrolling. We have sent a confirmation email to <strong>{formData.email}</strong> with the next steps and payment information.
              </p>
              <button onClick={() => window.location.reload()} className="text-primary font-medium hover:underline">Start New Application</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Student Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      value={formData.studentName}
                      onChange={e => setFormData({...formData, studentName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                    <select 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                      value={formData.gradeLevel}
                      onChange={e => setFormData({...formData, gradeLevel: e.target.value})}
                    >
                      <option>Middle School (6-8)</option>
                      <option>High School (9-12)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Guardian Information</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={formData.parentName}
                    onChange={e => setFormData({...formData, parentName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Course Selection</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
                  <select 
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                    value={formData.courseId}
                    onChange={e => setFormData({...formData, courseId: e.target.value})}
                  >
                    <option value="" disabled>-- Select a Course --</option>
                    {COURSES.map(course => (
                      <option key={course.id} value={course.id}>{course.title} ({course.level})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes / Needs</label>
                  <textarea 
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any specific learning requirements or questions?"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
                >
                  Submit Application
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By submitting this form, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
