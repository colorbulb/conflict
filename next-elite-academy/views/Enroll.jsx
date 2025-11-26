import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export const Enroll = ({ preselectedCourseId, onSubmitLead, courses }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitLead) {
      onSubmitLead({
        type: 'enrollment',
        ...formData
      });
    }
    setSuccess(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">Join Nexus Elite</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Student Enrollment</h1>
          <p className="text-slate-600 text-lg">Begin your journey towards academic excellence.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
          {success ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received</h2>
              <p className="text-slate-600 mb-10 max-w-md mx-auto">
                Thank you for enrolling. A confirmation email has been sent to <strong>{formData.email}</strong> with payment details and next steps.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition"
              >
                Return Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Student Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Student Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                      value={formData.studentName}
                      onChange={e => setFormData({...formData, studentName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Grade Level</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
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
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Guardian Information</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Parent / Guardian Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    value={formData.parentName}
                    onChange={e => setFormData({...formData, parentName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Course Selection</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
                  <select 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    value={formData.courseId}
                    onChange={e => setFormData({...formData, courseId: e.target.value})}
                  >
                    <option value="" disabled>-- Select a Course --</option>
                    {courses && courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title} ({course.level})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
                  <textarea 
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any specific learning requirements or questions?"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg transform hover:-translate-y-1"
                >
                  Submit Application
                </button>
                <p className="text-center text-xs text-slate-400 mt-6">
                  By submitting this form, you acknowledge that you have read and agreed to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};