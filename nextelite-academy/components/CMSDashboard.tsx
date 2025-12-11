import React, { useState, useEffect } from 'react';
import { Course, Instructor, ThemeColors, TrialSettings, Submission, Attachment, BlogPost } from '../types';
import { Edit, Save, Plus, Trash2, ArrowLeft, Settings, Calendar, Palette, Inbox, User, FileText, Image as ImageIcon, Briefcase, Info, List as ListIcon, X, CheckSquare, Clock, Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DEFAULT_TIME_SLOTS } from '../constants';
import RichTextEditor from './RichTextEditor';
import { translations as initialTranslations } from '../translations';

type TranslationsType = typeof initialTranslations;

interface CMSDashboardProps {
  courses: Course[];
  instructors: Instructor[];
  blogPosts?: BlogPost[];
  themeColors: ThemeColors;
  trialSettings: TrialSettings;
  submissions: Submission[];
  translations: TranslationsType;
  onUpdateCourse: (course: Course) => void;
  onUpdateInstructor: (instructor: Instructor) => void;
  onUpdateTheme: (colors: ThemeColors) => void;
  onUpdateTrial: (settings: TrialSettings) => void;
  onUpdateBlog?: (posts: BlogPost[]) => void;
  onUpdateTranslations: (translations: TranslationsType) => void;
  onLogout: () => void;
}

const CMSDashboard: React.FC<CMSDashboardProps> = ({ 
  courses, 
  instructors,
  blogPosts = [],
  themeColors,
  trialSettings,
  submissions,
  translations,
  onUpdateCourse, 
  onUpdateInstructor,
  onUpdateTheme,
  onUpdateTrial,
  onUpdateBlog,
  onUpdateTranslations,
  onLogout 
}) => {
  const { language, t } = useLanguage();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'blog' | 'instructors' | 'settings' | 'inquiries' | 'translations'>('courses');
  const [editingLang, setEditingLang] = useState<'en' | 'zh'>('en');
  const [localTranslations, setLocalTranslations] = useState<TranslationsType>(translations);

  useEffect(() => {
      setLocalTranslations(translations);
  }, [translations]);
  
  // Local state for settings form
  const [localColors, setLocalColors] = useState<ThemeColors>(themeColors);
  const [localTrial, setLocalTrial] = useState<TrialSettings>(trialSettings);
  
  // Calendar State for Admin
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const days = [];
    const today = new Date();
    // Show next 42 days (6 weeks) for a fuller calendar view
    for (let i = 0; i < 42; i++) { 
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    setCalendarDays(days);
  }, []);

  // --- Handlers ---

  const handleSaveCourse = () => {
    if (editingCourse) {
      onUpdateCourse(editingCourse);
      setEditingCourse(null);
    }
  };

  const handleAddCourse = () => {
      setEditingCourse({
          id: Math.random().toString(36).substr(2, 9),
          title: 'New Course',
          ageGroup: 'Primary 1 - 6',
          description: '',
          fullDescription: '',
          icon: 'coding', // Default key
          color: 'bg-brand-blue',
          outline: ['Module 1: Introduction'],
          attachments: [],
          galleryImages: [],
      });
  };

  const handleSaveInstructor = () => {
      if (editingInstructor) {
          onUpdateInstructor(editingInstructor);
          setEditingInstructor(null);
      }
  };

  const handleAddInstructor = () => {
      setEditingInstructor({
          id: Math.random().toString(36).substr(2, 9),
          name: 'New Instructor',
          role: 'Instructor',
          bio: '',
          imageUrl: 'https://picsum.photos/400/400'
      });
  };

  const handleSavePost = () => {
    if (editingPost && onUpdateBlog) {
       const isNew = !blogPosts.find(b => b.id === editingPost.id);
       let newPosts = [...blogPosts];
       if (isNew) {
           newPosts.push(editingPost);
       } else {
           newPosts = newPosts.map(p => p.id === editingPost.id ? editingPost : p);
       }
       onUpdateBlog(newPosts);
       setEditingPost(null);
    }
  };

  const handleDeletePost = (id: string) => {
      if (confirm('Delete this post?') && onUpdateBlog) {
          onUpdateBlog(blogPosts.filter(p => p.id !== id));
      }
  };

  const createNewPost = () => {
      setEditingPost({
          id: Math.random().toString(36).substr(2, 9),
          title: 'New Article',
          excerpt: '',
          content: '<p>Start writing...</p>',
          date: new Date().toISOString().split('T')[0],
          coverImage: 'https://picsum.photos/800/600',
          author: 'Admin',
          tags: []
      });
  };

  const handleSaveSettings = () => {
      onUpdateTheme(localColors);
      onUpdateTrial(localTrial);
      alert('Settings Saved!');
  };

  const handleSaveTranslations = () => {
      onUpdateTranslations(localTranslations);
      alert('Translations Saved!');
  };

  // Helper to update nested translation value
  const updateTranslationValue = (path: string[], value: string) => {
      const newTranslations = { ...localTranslations };
      const lang = editingLang;
      let current: any = newTranslations[lang];
      
      for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) current[path[i]] = {};
          current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      setLocalTranslations(newTranslations);
  };

  // Helper to get nested translation value
  const getTranslationValue = (path: string[]): string => {
      let current: any = localTranslations[editingLang];
      for (const key of path) {
          if (current && typeof current === 'object' && key in current) {
              current = current[key];
          } else {
              return '';
          }
      }
      return typeof current === 'string' ? current : '';
  };

  // Flatten translations for editing
  const flattenTranslations = (obj: any, prefix: string[] = []): Array<{ path: string[]; value: string; label: string }> => {
      const result: Array<{ path: string[]; value: string; label: string }> = [];
      for (const key in obj) {
          const newPath = [...prefix, key];
          if (typeof obj[key] === 'string') {
              result.push({
                  path: newPath,
                  value: obj[key],
                  label: newPath.join(' → ')
              });
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              result.push(...flattenTranslations(obj[key], newPath));
          }
      }
      return result;
  };

  // --- Helpers for Course Editor ---
  const updateCourseOutline = (idx: number, val: string) => {
      if (!editingCourse) return;
      const newOutline = [...editingCourse.outline];
      newOutline[idx] = val;
      setEditingCourse({...editingCourse, outline: newOutline});
  };
  const addOutlineItem = () => {
      if (!editingCourse) return;
      setEditingCourse({...editingCourse, outline: [...editingCourse.outline, 'New Module']});
  };
  const removeOutlineItem = (idx: number) => {
      if (!editingCourse) return;
      setEditingCourse({...editingCourse, outline: editingCourse.outline.filter((_, i) => i !== idx)});
  };


  // --- Calendar Logic ---

  const toggleDateSelection = (dateStr: string, ctrlPressed: boolean) => {
      const newSelected = new Set(selectedDates);
      if (newSelected.has(dateStr)) {
          newSelected.delete(dateStr);
      } else {
          newSelected.add(dateStr);
      }
      setSelectedDates(newSelected);
  };

  const handleSelectAll = () => {
      const allDates = calendarDays.map(d => d.toISOString().split('T')[0]);
      setSelectedDates(new Set(allDates));
  };

  const handleDeselectAll = () => {
      setSelectedDates(new Set());
  };

  const handleBulkBlock = () => {
      const currentBlocked = new Set(localTrial.blockedDates || []);
      selectedDates.forEach(d => currentBlocked.add(d));
      const newCustom = { ...localTrial.customAvailability };
      selectedDates.forEach(d => delete newCustom[d]);
      setLocalTrial(prev => ({ ...prev, blockedDates: Array.from(currentBlocked), customAvailability: newCustom }));
  };

  const handleBulkAvailable = () => {
      const currentBlocked = new Set(localTrial.blockedDates || []);
      selectedDates.forEach(d => currentBlocked.delete(d));
      const newCustom = { ...localTrial.customAvailability };
      selectedDates.forEach(d => delete newCustom[d]);
      setLocalTrial({ ...localTrial, blockedDates: Array.from(currentBlocked), customAvailability: newCustom });
  };

  const toggleTimeSlotForSelected = (timeSlot: string) => {
      const newCustom = { ...(localTrial.customAvailability || {}) };
      let allHaveSlot = true;
      selectedDates.forEach(d => {
          const slots = newCustom[d] || DEFAULT_TIME_SLOTS;
          if (!slots.includes(timeSlot)) allHaveSlot = false;
      });

      selectedDates.forEach(dateStr => {
          let currentSlots = newCustom[dateStr] || [...DEFAULT_TIME_SLOTS];
          if (allHaveSlot) {
              currentSlots = currentSlots.filter(s => s !== timeSlot);
          } else {
              if (!currentSlots.includes(timeSlot)) {
                  currentSlots = [...currentSlots, timeSlot].sort((a,b) => {
                       return DEFAULT_TIME_SLOTS.indexOf(a) - DEFAULT_TIME_SLOTS.indexOf(b);
                  });
              }
          }
          newCustom[dateStr] = currentSlots;
      });

      const newBlocked = localTrial.blockedDates.filter(d => !selectedDates.has(d));
      setLocalTrial({ ...localTrial, blockedDates: newBlocked, customAvailability: newCustom });
  };

  // --- Views ---

  if (editingCourse) {
      return (
        <div className="p-6 max-w-5xl mx-auto">
            <button onClick={() => setEditingCourse(null)} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className={`p-8 border-b border-gray-100 flex justify-between items-center ${editingCourse.color} text-white`}>
                    <h2 className="text-2xl font-bold font-display">Edit Course</h2>
                    <button onClick={handleSaveCourse} className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-gray-800 font-bold hover:bg-gray-100 shadow-sm transition-transform hover:scale-105">
                        <Save className="w-4 h-4" /> Save Course
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Course Title</label>
                            <input 
                                value={editingCourse.title}
                                onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Age Group</label>
                            <input 
                                value={editingCourse.ageGroup}
                                onChange={(e) => setEditingCourse({...editingCourse, ageGroup: e.target.value})}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                             <textarea 
                                value={editingCourse.description}
                                onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
                                rows={2}
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-bold text-gray-700 mb-1">Full Description</label>
                             <textarea 
                                value={editingCourse.fullDescription || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, fullDescription: e.target.value})}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Styling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Color Theme</label>
                            <select 
                                value={editingCourse.color}
                                onChange={(e) => setEditingCourse({...editingCourse, color: e.target.value})}
                                className="w-full border rounded-xl p-3 bg-white"
                            >
                                <option value="bg-brand-blue">Blue</option>
                                <option value="bg-brand-orange">Orange</option>
                                <option value="bg-brand-green">Green</option>
                                <option value="bg-brand-purple">Purple</option>
                                <option value="bg-brand-yellow">Yellow</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Icon Key</label>
                            <select 
                                value={typeof editingCourse.icon === 'string' ? editingCourse.icon : 'coding'}
                                onChange={(e) => setEditingCourse({...editingCourse, icon: e.target.value})}
                                className="w-full border rounded-xl p-3 bg-white"
                            >
                                <option value="debate">Debate (Book)</option>
                                <option value="logic">Logic (Brain)</option>
                                <option value="coding">Coding (CPU)</option>
                            </select>
                         </div>
                    </div>

                    {/* Outline */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-gray-700">Course Outline</label>
                            <button onClick={addOutlineItem} className="text-xs text-brand-blue font-bold flex items-center hover:bg-blue-50 px-2 py-1 rounded">
                                <Plus className="w-3 h-3 mr-1" /> Add Module
                            </button>
                        </div>
                        <div className="space-y-2">
                            {editingCourse.outline.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <div className="bg-gray-100 flex items-center justify-center w-8 rounded text-gray-500 text-xs font-bold">{idx + 1}</div>
                                    <input 
                                        value={item}
                                        onChange={(e) => updateCourseOutline(idx, e.target.value)}
                                        className="flex-1 border rounded-lg p-2 text-sm"
                                    />
                                    <button onClick={() => removeOutlineItem(idx)} className="text-red-400 hover:text-red-600 p-2">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (editingInstructor) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
            <button onClick={() => setEditingInstructor(null)} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Instructors
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Instructor</h2>
                    <button onClick={handleSaveInstructor} className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105">
                        <Save className="w-4 h-4" /> Save Instructor
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex gap-6 items-start">
                         <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0">
                             <img src={editingInstructor.imageUrl} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 space-y-4">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input 
                                    value={editingInstructor.name}
                                    onChange={(e) => setEditingInstructor({...editingInstructor, name: e.target.value})}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Role / Title</label>
                                <input 
                                    value={editingInstructor.role}
                                    onChange={(e) => setEditingInstructor({...editingInstructor, role: e.target.value})}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                             </div>
                         </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Profile Image URL</label>
                        <input 
                            value={editingInstructor.imageUrl}
                            onChange={(e) => setEditingInstructor({...editingInstructor, imageUrl: e.target.value})}
                            className="w-full border rounded-xl p-3 text-sm font-mono text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Biography</label>
                        <textarea 
                            value={editingInstructor.bio}
                            onChange={(e) => setEditingInstructor({...editingInstructor, bio: e.target.value})}
                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none h-32"
                        />
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (editingPost) {
      return (
        <div className="p-6 max-w-5xl mx-auto">
            <button onClick={() => setEditingPost(null)} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog List
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Article</h2>
                    <button onClick={handleSavePost} className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105">
                        <Save className="w-4 h-4" /> Save Post
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="p-8 col-span-2 space-y-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Article Title</label>
                            <input 
                                value={editingPost.title}
                                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                className="w-full border rounded-xl p-3 text-lg font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                                placeholder="Enter title..."
                            />
                         </div>
                         
                         {/* WYSIWYG Editor */}
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                             <RichTextEditor 
                                key={editingPost.id} // Re-mount if ID changes
                                initialValue={editingPost.content}
                                onChange={(html) => setEditingPost({...editingPost, content: html})}
                             />
                         </div>
                         
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Excerpt</label>
                             <textarea 
                                 value={editingPost.excerpt}
                                 onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                                 className="w-full border rounded-xl p-3 h-20 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                 placeholder="Short summary for the card view..."
                             />
                         </div>
                    </div>

                    <div className="p-8 bg-gray-50 border-l border-gray-100 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image URL</label>
                            <div className="rounded-xl overflow-hidden h-40 bg-gray-100 mb-2 border border-gray-200">
                                <img src={editingPost.coverImage} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                            <input 
                                value={editingPost.coverImage}
                                onChange={(e) => setEditingPost({...editingPost, coverImage: e.target.value})}
                                className="w-full border rounded-lg p-2 text-xs text-gray-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    value={editingPost.author}
                                    onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                                    className="w-full border rounded-lg pl-9 p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                            <input 
                                type="date"
                                value={editingPost.date}
                                onChange={(e) => setEditingPost({...editingPost, date: e.target.value})}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                            <input 
                                value={editingPost.tags.join(', ')}
                                onChange={(e) => setEditingPost({...editingPost, tags: e.target.value.split(',').map(s => s.trim())})}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- Main Dashboard View ---

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-brand-blue p-2 rounded-lg">
                <Settings className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-800">CMS Dashboard</h1>
                <p className="text-xs text-gray-500">Managing: <span className="font-bold uppercase text-brand-blue">{language}</span> Site</p>
            </div>
        </div>
        <button onClick={onLogout} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-full transition-colors">Logout</button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('courses')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'courses' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Briefcase className="w-4 h-4" /> Courses
          </button>
          <button onClick={() => setActiveTab('blog')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'blog' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <FileText className="w-4 h-4" /> Blog
          </button>
          <button onClick={() => setActiveTab('instructors')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'instructors' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <User className="w-4 h-4" /> Instructors
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'inquiries' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Inbox className="w-4 h-4" /> {t.admin.inquiries}
          </button>
          <button onClick={() => setActiveTab('translations')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'translations' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Languages className="w-4 h-4" /> Translations
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* --- Tab Content --- */}

        {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end">
                    <button onClick={handleAddCourse} className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                        <Plus className="w-5 h-5" /> Add New Course
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-2 h-full ${course.color}`}></div>
                            <div className="flex justify-between items-start mb-4 pl-4">
                                <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                                <button onClick={() => setEditingCourse(course)} className="text-gray-400 hover:text-brand-blue bg-gray-50 p-2 rounded-lg transition-colors">
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-4 pl-4">{course.description}</p>
                            <div className="pl-4 pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {course.ageGroup}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'instructors' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end">
                    <button onClick={handleAddInstructor} className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                        <Plus className="w-5 h-5" /> Add Instructor
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructors.map(inst => (
                        <div key={inst.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                            <img src={inst.imageUrl} alt={inst.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-yellow" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 truncate">{inst.name}</h3>
                                <p className="text-sm text-brand-blue font-medium truncate">{inst.role}</p>
                            </div>
                            <button onClick={() => setEditingInstructor(inst)} className="text-gray-400 hover:text-brand-blue p-2">
                                <Edit className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {activeTab === 'blog' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end">
                    <button onClick={createNewPost} className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                        <Plus className="w-5 h-5" /> New Article
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.map(post => (
                        <div key={post.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 group hover:shadow-xl transition-all">
                            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                   <h3 className="font-bold text-gray-800 truncate pr-2 flex-1">{post.title}</h3>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{new Date(post.date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2 flex-1">{post.excerpt}</p>
                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => setEditingPost(post)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                       <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'inquiries' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.type}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Name</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.contact}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Course Interest</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.details}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.date}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${sub.type === 'trial' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {sub.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-700">{sub.name}</td>
                                    <td className="p-4 text-sm text-gray-600">{sub.contactInfo}</td>
                                    <td className="p-4 text-sm text-gray-800 font-medium">{sub.courseInterest || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{sub.details}</td>
                                    <td className="p-4 text-xs text-gray-400 font-mono">
                                        {new Date(sub.timestamp).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'translations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-brand-blue p-1.5 rounded-lg text-white"><Languages className="w-5 h-5" /></div>
                            Translation Editor
                        </h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setEditingLang('en')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${editingLang === 'en' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                English
                            </button>
                            <button 
                                onClick={() => setEditingLang('zh')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${editingLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                中文
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {flattenTranslations(localTranslations[editingLang]).map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                    {item.label}
                                </label>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => updateTranslationValue(item.path, e.target.value)}
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white focus:bg-white transition-colors"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button 
                            onClick={handleSaveTranslations}
                            className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                        >
                            <Save className="w-5 h-5" /> Save Translations
                        </button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Brand Colors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="bg-brand-purple p-1.5 rounded-lg text-white"><Palette className="w-5 h-5" /></div>
                        Theme Colors
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(localColors).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <label className="capitalize font-bold text-gray-600 text-sm">Brand {key}</label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{value}</span>
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <input 
                                            type="color" 
                                            value={value}
                                            onChange={(e) => setLocalColors({...localColors, [key]: e.target.value})}
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Free Trial Settings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                     <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="bg-brand-orange p-1.5 rounded-lg text-white"><Calendar className="w-5 h-5" /></div>
                        Free Trial Calendar
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                            <span className="font-bold text-gray-700">Accepting Bookings</span>
                            <button 
                                onClick={() => setLocalTrial({...localTrial, enabled: !localTrial.enabled})}
                                className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${localTrial.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${localTrial.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        
                        <div className={!localTrial.enabled ? 'opacity-50 pointer-events-none' : ''}>
                             <div className="flex justify-between items-center mb-3">
                                <div className="space-x-3">
                                    <button onClick={handleSelectAll} className="text-xs text-brand-blue font-bold hover:bg-blue-50 px-2 py-1 rounded transition-colors">Select All</button>
                                    <button onClick={handleDeselectAll} className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded transition-colors">Clear</button>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{selectedDates.size} selected</span>
                             </div>

                             {/* Calendar Grid */}
                             <div className="grid grid-cols-7 gap-2 mb-4">
                                {['S','M','T','W','T','F','S'].map((d,i) => (
                                    <div key={i} className="text-center text-xs font-extrabold text-gray-300">{d}</div>
                                ))}
                                {calendarDays.map((date, idx) => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    const isBlocked = (localTrial.blockedDates || []).includes(dateStr);
                                    const isSelected = selectedDates.has(dateStr);
                                    const hasCustom = localTrial.customAvailability && localTrial.customAvailability[dateStr];

                                    let bgClass = "bg-white text-gray-600 border-gray-100 hover:border-brand-blue/50";
                                    if (isBlocked) bgClass = "bg-red-50 text-red-300 border-red-100 decoration-red-300 line-through";
                                    else if (hasCustom) bgClass = "bg-blue-50 text-brand-blue border-blue-200 font-bold";
                                    else bgClass = "bg-green-50 text-green-600 border-green-100";

                                    return (
                                        <button 
                                            key={idx}
                                            onClick={(e) => toggleDateSelection(dateStr, e.ctrlKey || e.metaKey)}
                                            className={`aspect-square rounded-lg border flex items-center justify-center text-xs transition-all relative ${bgClass} ${isSelected ? 'ring-2 ring-brand-purple ring-offset-2 z-10 shadow-md transform scale-105' : ''}`}
                                            title={`${dateStr}`}
                                        >
                                            {date.getDate()}
                                            {hasCustom && !isBlocked && <div className="absolute bottom-1 w-1 h-1 bg-brand-blue rounded-full"></div>}
                                        </button>
                                    )
                                })}
                             </div>
                             
                             {/* Bulk Actions Bar */}
                             {selectedDates.size > 0 && (
                                 <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 animate-in fade-in slide-in-from-top-2 shadow-xl">
                                     <div className="flex gap-2 mb-4">
                                         <button onClick={handleBulkBlock} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                             Block Selected
                                         </button>
                                         <button onClick={handleBulkAvailable} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                             Reset to Default
                                         </button>
                                     </div>
                                     
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-2"><Clock className="w-3 h-3" /> Toggle Slots</h4>
                                         <div className="grid grid-cols-4 gap-2">
                                            {DEFAULT_TIME_SLOTS.map(slot => (
                                                <button 
                                                    key={slot} 
                                                    onClick={() => toggleTimeSlotForSelected(slot)} 
                                                    className="text-[10px] font-bold py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                         </div>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 mt-4">
                     <button 
                        onClick={handleSaveSettings}
                        className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                     >
                        <Save className="w-5 h-5" /> Save Global Settings
                     </button>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default CMSDashboard;