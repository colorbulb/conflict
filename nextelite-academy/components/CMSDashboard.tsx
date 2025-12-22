import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Course, Instructor, ThemeColors, TrialSettings, Submission, Attachment, BlogPost, PageContent, CustomPage, MenuItem } from '../types';
import { Edit, Save, Plus, Trash2, ArrowLeft, Settings, Calendar, Palette, Inbox, User, FileText, Image as ImageIcon, Briefcase, Info, List as ListIcon, X, CheckSquare, Clock, Languages, Home, Upload, GripVertical, Eye, Trophy } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DEFAULT_TIME_SLOTS, INITIAL_DATA } from '../constants';
import RichTextEditor from './RichTextEditor';
import { translations as initialTranslations } from '../translations';
import { uploadImage, uploadPDF, uploadMultipleImages } from '../firebase/storage';
import { ICONS } from '../constants';
import PDFViewer from './PDFViewer';
import LayoutBuilder, { LayoutBlock } from './LayoutBuilder';
import CustomPageEditor from './dashboard/CustomPageEditor';

type TranslationsType = typeof initialTranslations;

interface CMSDashboardProps {
  courses: Course[];
  instructors: Instructor[];
  blogPosts?: BlogPost[];
  themeColors: ThemeColors;
  trialSettings: TrialSettings;
  submissions: Submission[];
  translations: TranslationsType;
  pageContent: PageContent;
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] };
    customPages?: CustomPage[];
  menuItems?: MenuItem[];
  enMenuItems?: MenuItem[];
  zhMenuItems?: MenuItem[];
  onUpdateCourse: (course: Course) => void;
  onUpdateInstructor: (instructor: Instructor) => void;
  onUpdateTheme: (colors: ThemeColors) => void;
  onUpdateTrial: (settings: TrialSettings) => void;
  onUpdateBlog?: (posts: BlogPost[]) => void;
  onUpdateTranslations: (translations: TranslationsType) => void;
  onUpdatePageContent: (pageContent: PageContent) => void;
  onUpdateLookupLists: (lists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] }) => void;
  onUpdateCustomPages?: (pages: CustomPage[], lang?: 'en' | 'zh') => Promise<void>;
  onUpdateMenuItems?: (items: MenuItem[], lang?: 'en' | 'zh') => Promise<void>;
  initialTab?: 'courses' | 'blog' | 'instructors' | 'settings' | 'inquiries' | 'homepage' | 'lookups' | 'pages' | 'menu';
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
  pageContent,
  lookupLists,
  customPages = [],
  enCustomPages = [],
  zhCustomPages = [],
  menuItems = [],
  enMenuItems = [],
  zhMenuItems = [],
  onUpdateCourse, 
  onUpdateInstructor,
  onUpdateTheme,
  onUpdateTrial,
  onUpdateBlog,
  onUpdateTranslations,
  onUpdatePageContent,
  onUpdateLookupLists,
  onUpdateCustomPages,
  onUpdateMenuItems,
  initialTab = 'courses',
  onLogout 
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
    const [localCustomPages, setLocalCustomPages] = useState<CustomPage[]>(customPages || []);
    useEffect(() => { setLocalCustomPages(customPages || []); }, [customPages]);
  const [activeTab, setActiveTab] = useState<'courses' | 'blog' | 'instructors' | 'settings' | 'inquiries' | 'homepage' | 'lookups' | 'pages' | 'menu'>(initialTab);
  
  // Sync activeTab with URL
  useEffect(() => {
    const urlTab = location.pathname.split('/')[2] || 'courses';
    const validTabs = ['courses', 'blog', 'instructors', 'settings', 'inquiries', 'homepage', 'lookups', 'pages', 'menu'];
    if (validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab as typeof validTabs[number]);
    }
  }, [location.pathname]);
  
  // Update URL when tab changes
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    navigate(`/adminbn/${tab}`, { replace: true });
  };
  const [editingLang, setEditingLang] = useState<'en' | 'zh'>('en');
  const [menuEditingLang, setMenuEditingLang] = useState<'en' | 'zh'>('en');
  const [localTranslations, setLocalTranslations] = useState<TranslationsType>(translations);
  const [localPageContent, setLocalPageContent] = useState<PageContent>(pageContent);
  const [localLookupLists, setLocalLookupLists] = useState<{ ageGroups: string[]; courseCategories: string[] }>(lookupLists);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);
  
  // Menu items for both languages
  const [localEnMenuItems, setLocalEnMenuItems] = useState<MenuItem[]>(enMenuItems);
  const [localZhMenuItems, setLocalZhMenuItems] = useState<MenuItem[]>(zhMenuItems);
  
  // Update local menu items when props change
  useEffect(() => {
    setLocalEnMenuItems(enMenuItems);
  }, [enMenuItems]);
  
  useEffect(() => {
    setLocalZhMenuItems(zhMenuItems);
  }, [zhMenuItems]);
  
  // Get current menu items based on editing language
  const currentMenuItems = menuEditingLang === 'en' ? localEnMenuItems : localZhMenuItems;
  const setCurrentMenuItems = menuEditingLang === 'en' ? setLocalEnMenuItems : setLocalZhMenuItems;

  useEffect(() => {
      setLocalTranslations(translations);
  }, [translations]);

  useEffect(() => {
      setLocalPageContent(pageContent);
  }, [pageContent]);

  useEffect(() => {
      setLocalLookupLists({
          ageGroups: lookupLists.ageGroups || [],
          courseCategories: lookupLists.courseCategories || [],
          blogCategories: lookupLists.blogCategories || []
      });
  }, [lookupLists]);
  
  // Local state for settings form
  const [localColors, setLocalColors] = useState<ThemeColors>(
    themeColors && Object.keys(themeColors).length
      ? themeColors
      : INITIAL_DATA[language].themeColors
  );
  const [localTrial, setLocalTrial] = useState<TrialSettings>(
    trialSettings && Object.keys(trialSettings).length
      ? trialSettings
      : INITIAL_DATA[language].trialSettings
  );
  
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
          ageGroup: localLookupLists.ageGroups.length > 0 ? [localLookupLists.ageGroups[0]] : ['All Ages'],
          category: localLookupLists.courseCategories[0] || 'Other',
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
          tags: [],
          category: localLookupLists.blogCategories.length > 0 ? localLookupLists.blogCategories[0] : undefined,
          layoutBlocks: undefined
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

  const handleSavePageContent = () => {
      onUpdatePageContent(localPageContent);
      alert('Homepage Content Saved! Please refresh the homepage to see changes.');
  };

  const handleSaveLookupLists = () => {
      onUpdateLookupLists(localLookupLists);
      alert('Lookup Lists Saved!');
  };

  const handleImageUpload = async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setIsUploading(true);
      try {
          const uploadPromises = Array.from(files).map(file => uploadImage(file, 'gallery'));
          const results = await Promise.all(uploadPromises);
          const newUrls = results.map(r => r.url);
          setLocalPageContent({
              ...localPageContent,
              galleryImages: [...localPageContent.galleryImages, ...newUrls]
          });
      } catch (error) {
          console.error('Error uploading images:', error);
          alert('Error uploading images. Please try again.');
      } finally {
          setIsUploading(false);
      }
  };

  const handleImageDelete = (index: number) => {
      if (confirm('Delete this image?')) {
          const newImages = localPageContent.galleryImages.filter((_, i) => i !== index);
          setLocalPageContent({
              ...localPageContent,
              galleryImages: newImages
          });
      }
  };

  const handleImageDragStart = (index: number) => {
      setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedImageIndex === null) return;
      
      const newImages = [...localPageContent.galleryImages];
      const draggedItem = newImages[draggedImageIndex];
      newImages.splice(draggedImageIndex, 1);
      newImages.splice(dropIndex, 0, draggedItem);
      
      setLocalPageContent({
          ...localPageContent,
          galleryImages: newImages
      });
      setDraggedImageIndex(null);
  };

  const handleImageUrlAdd = (url: string) => {
      if (url.trim()) {
          setLocalPageContent({
              ...localPageContent,
              galleryImages: [...localPageContent.galleryImages, url.trim()]
          });
      }
  };

  // Upload background media for a specific section (hero/programs/mentors/gallery/contact/about) or logo
  const handleBackgroundUpload = async (
    section:
      | 'hero'
      | 'programs'
      | 'mentors'
      | 'gallery'
      | 'contact'
      | 'about'
      | 'logo',
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const folder = section === 'logo' ? 'logo' : 'backgrounds';
      const uploaded = await uploadImage(file, folder);
      
      if (section === 'logo') {
        setLocalPageContent({
          ...localPageContent,
          logo: uploaded.url,
        });
        alert(`Logo uploaded! Don't forget to click "Save Homepage" to persist the change.`);
      } else {
        setLocalPageContent({
          ...localPageContent,
          backgrounds: {
            ...(localPageContent.backgrounds || {}),
            [section]: uploaded.url,
          },
        });
        alert(`Background uploaded! Don't forget to click "Save Homepage" to persist the change.`);
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Error uploading. Please try again.');
    }
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
                    <button
                      onClick={handleSaveCourse}
                      className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
                    >
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Age Groups (Select Multiple)</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-xl p-4 bg-gray-50">
                                {localLookupLists.ageGroups.map(age => (
                                    <label key={age} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(editingCourse.ageGroup) ? editingCourse.ageGroup.includes(age) : false}
                                            onChange={(e) => {
                                                const currentAgeGroups = Array.isArray(editingCourse.ageGroup) ? editingCourse.ageGroup : [];
                                                if (e.target.checked) {
                                                    setEditingCourse({
                                                        ...editingCourse,
                                                        ageGroup: [...currentAgeGroups, age]
                                                    });
                                                } else {
                                                    setEditingCourse({
                                                        ...editingCourse,
                                                        ageGroup: currentAgeGroups.filter(ag => ag !== age)
                                                    });
                                                }
                                            }}
                                            className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                                        />
                                        <span className="text-sm text-gray-700">{age}</span>
                                    </label>
                                ))}
                            </div>
                            {Array.isArray(editingCourse.ageGroup) && editingCourse.ageGroup.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">Please select at least one age group</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select 
                                value={editingCourse.category || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
                            >
                                <option value="">Select Category</option>
                                {localLookupLists.courseCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
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
                             <RichTextEditor
                                initialValue={editingCourse.fullDescription || ''}
                                onChange={(html) => setEditingCourse({...editingCourse, fullDescription: html})}
                                placeholder="Enter detailed course description..."
                             />
                        </div>
                    </div>

                    {/* Header Background Image */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Course Detail Header Background</label>
                        {editingCourse.headerBackgroundImage && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                                <img src={editingCourse.headerBackgroundImage} alt="Header Background" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input 
                            type="text"
                            value={editingCourse.headerBackgroundImage || ''}
                            onChange={(e) => setEditingCourse({...editingCourse, headerBackgroundImage: e.target.value})}
                            className="w-full border rounded-lg p-2 text-xs text-gray-500 font-mono mb-2"
                            placeholder="Image URL or drag & drop image below"
                        />
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                            }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                
                                const files = e.dataTransfer.files;
                                if (files && files.length > 0) {
                                    const file = files[0];
                                    if (file.type.startsWith('image/')) {
                                        try {
                                            setIsUploading(true);
                                            const uploaded = await uploadImage(file, 'backgrounds');
                                            setEditingCourse({
                                                ...editingCourse,
                                                headerBackgroundImage: uploaded.url
                                            });
                                        } catch (error) {
                                            console.error('Error uploading background image:', error);
                                            alert('Error uploading image. Please try again.');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    } else {
                                        alert('Please upload an image file (PNG, JPG, GIF, etc.)');
                                    }
                                }
                            }}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors mb-2"
                        >
                            {isUploading ? (
                                <div className="text-gray-500 text-xs">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue mx-auto mb-1"></div>
                                    Uploading...
                                </div>
                            ) : (
                                <div className="text-gray-500 text-xs">
                                    <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                    <p className="font-bold">Drag & drop background image</p>
                                    <p className="text-xs mt-0.5">or click to browse</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    const file = files[0];
                                    try {
                                        setIsUploading(true);
                                        const uploaded = await uploadImage(file, 'backgrounds');
                                        setEditingCourse({
                                            ...editingCourse,
                                            headerBackgroundImage: uploaded.url
                                        });
                                    } catch (error) {
                                        console.error('Error uploading background image:', error);
                                        alert('Error uploading image. Please try again.');
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }
                            }}
                            className="hidden"
                            id="course-header-bg-upload"
                        />
                        <label
                            htmlFor="course-header-bg-upload"
                            className="mt-1 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer mb-3"
                        >
                            Or click to browse files
                        </label>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Opacity (0.0 - 1.0)</label>
                            <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={editingCourse.headerBackgroundOpacity !== undefined ? editingCourse.headerBackgroundOpacity : 0.2}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    headerBackgroundOpacity: parseFloat(e.target.value) || 0.2
                                })}
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Default: 0.2 (20% opacity)</p>
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
                            <label className="block text-sm font-bold text-gray-700 mb-1">Icon</label>
                            <select 
                                value={typeof editingCourse.icon === 'string' ? editingCourse.icon : 'coding'}
                                onChange={(e) => setEditingCourse({...editingCourse, icon: e.target.value})}
                                className="w-full border rounded-xl p-3 bg-white"
                            >
                                <option value="debate">Debate (Book)</option>
                                <option value="logic">Logic (Brain)</option>
                                <option value="coding">Coding (CPU)</option>
                                <option value="graduation">Graduation Cap</option>
                                <option value="code">Code</option>
                                <option value="users">Users</option>
                                <option value="target">Target</option>
                                <option value="lightbulb">Lightbulb</option>
                                <option value="calculator">Calculator</option>
                                <option value="globe">Globe</option>
                                <option value="music">Music</option>
                                <option value="paintbrush">Paintbrush</option>
                                <option value="gamepad">Gamepad</option>
                                <option value="flask">Flask</option>
                                <option value="bookmarked">Bookmarked</option>
                                <option value="languages">Languages</option>
                                <option value="sparkles">Sparkles</option>
                                <option value="rocket">Rocket</option>
                                <option value="award">Award</option>
                                <option value="trending">Trending Up</option>
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

                    {/* Attachments (PDF) */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-gray-700">Attachments (PDF)</label>
                        </div>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                            }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                const files = Array.from(e.dataTransfer.files).filter((f: File) => f.type === 'application/pdf');
                                if (files.length > 0) {
                                    try {
                                        setIsUploading(true);
                                        const uploadPromises = files.map(file => uploadPDF(file, 'attachments'));
                                        const results = await Promise.all(uploadPromises);
                                        setEditingCourse({
                                            ...editingCourse,
                                            attachments: [...editingCourse.attachments, ...results]
                                        });
                                        alert('PDF(s) uploaded! Don\'t forget to save the course.');
                                    } catch (error) {
                                        console.error('Error uploading PDF:', error);
                                        alert('Error uploading PDF. Please try again.');
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }
                            }}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-1">Drag & drop PDF files here</p>
                            <p className="text-xs text-gray-500">or click to select files</p>
                            <input
                                type="file"
                                accept=".pdf"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        try {
                                            setIsUploading(true);
                                            const uploadPromises = Array.from(files).map(file => uploadPDF(file, 'attachments'));
                                            const results = await Promise.all(uploadPromises);
                                            setEditingCourse({
                                                ...editingCourse,
                                                attachments: [...editingCourse.attachments, ...results]
                                            });
                                            alert('PDF(s) uploaded! Don\'t forget to save the course.');
                                        } catch (error) {
                                            console.error('Error uploading PDF:', error);
                                            alert('Error uploading PDF. Please try again.');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }
                                }}
                            />
                        </div>
                        {editingCourse.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {editingCourse.attachments.map((att, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-red-500" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{att.name}</p>
                                                <p className="text-xs text-gray-500">{att.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setViewingPdf({ url: att.url, title: att.name })}
                                                className="text-brand-blue hover:text-brand-purple text-sm font-bold flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" /> View
                                            </button>
                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 text-sm">
                                                <FileText className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this attachment?')) {
                                                        setEditingCourse({
                                                            ...editingCourse,
                                                            attachments: editingCourse.attachments.filter((_, i) => i !== idx)
                                                        });
                                                    }
                                                }}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Gallery Images */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-gray-700">Gallery Images</label>
                        </div>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                            }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                const files = Array.from(e.dataTransfer.files).filter((f) => (f as File).type.startsWith('image/'));
                                if (files.length > 0) {
                                    try {
                                        setIsUploading(true);
                                        const results = await uploadMultipleImages(files, 'gallery');
                                        const newUrls = results.map(r => r.url);
                                        setEditingCourse({
                                            ...editingCourse,
                                            galleryImages: [...(editingCourse.galleryImages || []), ...newUrls]
                                        });
                                        alert('Images uploaded! Don\'t forget to save the course.');
                                    } catch (error) {
                                        console.error('Error uploading images:', error);
                                        alert('Error uploading images. Please try again.');
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }
                            }}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.multiple = true;
                                input.onchange = async (e) => {
                                    const files = (e.target as HTMLInputElement).files;
                                    if (files && files.length > 0) {
                                        try {
                                            setIsUploading(true);
                                            const results = await uploadMultipleImages(files, 'gallery');
                                            const newUrls = results.map(r => r.url);
                                            setEditingCourse({
                                                ...editingCourse,
                                                galleryImages: [...(editingCourse.galleryImages || []), ...newUrls]
                                            });
                                            alert('Images uploaded! Don\'t forget to save the course.');
                                        } catch (error) {
                                            console.error('Error uploading images:', error);
                                            alert('Error uploading images. Please try again.');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }
                                };
                                input.click();
                            }}
                        >
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-1">Drag & drop images here</p>
                            <p className="text-xs text-gray-500">or click to select images</p>
                        </div>
                        {editingCourse.galleryImages && editingCourse.galleryImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {editingCourse.galleryImages.map((imgUrl, idx) => (
                                    <div key={idx} className="relative group">
                                        <img 
                                            src={imgUrl} 
                                            alt={`Gallery ${idx + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => {
                                                // Open lightbox modal
                                                const modal = document.createElement('div');
                                                modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4';
                                                modal.onclick = () => document.body.removeChild(modal);
                                                const img = document.createElement('img');
                                                img.src = imgUrl;
                                                img.className = 'max-w-full max-h-full object-contain';
                                                img.onclick = (e) => e.stopPropagation();
                                                modal.appendChild(img);
                                                document.body.appendChild(modal);
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this image?')) {
                                                    setEditingCourse({
                                                        ...editingCourse,
                                                        galleryImages: editingCourse.galleryImages?.filter((_, i) => i !== idx) || []
                                                    });
                                                }
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quiz Editor */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-gray-700">Quiz Module</label>
                            <button
                                onClick={() => {
                                    if (!editingCourse.quiz) {
                                        setEditingCourse({
                                            ...editingCourse,
                                            quiz: {
                                                title: 'Course Quiz',
                                                questions: []
                                            }
                                        });
                                    } else {
                                        if (confirm('Remove quiz from this course?')) {
                                            setEditingCourse({
                                                ...editingCourse,
                                                quiz: undefined
                                            });
                                        }
                                    }
                                }}
                                className="text-xs text-brand-blue hover:text-brand-purple font-bold flex items-center gap-1"
                            >
                                {editingCourse.quiz ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {editingCourse.quiz ? 'Remove Quiz' : 'Add Quiz'}
                            </button>
                        </div>
                        
                        {editingCourse.quiz && (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Quiz Title</label>
                                    <input
                                        type="text"
                                        value={editingCourse.quiz.title}
                                        onChange={(e) =>
                                            setEditingCourse({
                                                ...editingCourse,
                                                quiz: {
                                                    ...editingCourse.quiz!,
                                                    title: e.target.value
                                                }
                                            })
                                        }
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                                        placeholder="Course Quiz"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold text-gray-700">Questions</label>
                                        <button
                                            onClick={() => {
                                                setEditingCourse({
                                                    ...editingCourse,
                                                    quiz: {
                                                        ...editingCourse.quiz!,
                                                        questions: [
                                                            ...editingCourse.quiz!.questions,
                                                            {
                                                                question: '',
                                                                options: ['', '', '', ''],
                                                                correctIndex: 0
                                                            }
                                                        ]
                                                    }
                                                });
                                            }}
                                            className="text-xs text-brand-blue hover:text-brand-purple font-bold flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Question
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {editingCourse.quiz.questions.map((q, qIdx) => (
                                            <div key={qIdx} className="bg-white p-4 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-xs font-bold text-gray-500">Question {qIdx + 1}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Delete this question?')) {
                                                                setEditingCourse({
                                                                    ...editingCourse,
                                                                    quiz: {
                                                                        ...editingCourse.quiz!,
                                                                        questions: editingCourse.quiz!.questions.filter((_, i) => i !== qIdx)
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={q.question}
                                                    onChange={(e) => {
                                                        const newQuestions = [...editingCourse.quiz!.questions];
                                                        newQuestions[qIdx].question = e.target.value;
                                                        setEditingCourse({
                                                            ...editingCourse,
                                                            quiz: {
                                                                ...editingCourse.quiz!,
                                                                questions: newQuestions
                                                            }
                                                        });
                                                    }}
                                                    className="w-full border rounded-lg p-2 text-sm mb-3 focus:ring-2 focus:ring-brand-blue outline-none"
                                                    placeholder="Enter question text..."
                                                />

                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">Options</label>
                                                    {q.options.map((opt, optIdx) => (
                                                        <div key={optIdx} className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name={`correct-${qIdx}`}
                                                                checked={q.correctIndex === optIdx}
                                                                onChange={() => {
                                                                    const newQuestions = [...editingCourse.quiz!.questions];
                                                                    newQuestions[qIdx].correctIndex = optIdx;
                                                                    setEditingCourse({
                                                                        ...editingCourse,
                                                                        quiz: {
                                                                            ...editingCourse.quiz!,
                                                                            questions: newQuestions
                                                                        }
                                                                    });
                                                                }}
                                                                className="text-brand-blue"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => {
                                                                    const newQuestions = [...editingCourse.quiz!.questions];
                                                                    newQuestions[qIdx].options[optIdx] = e.target.value;
                                                                    setEditingCourse({
                                                                        ...editingCourse,
                                                                        quiz: {
                                                                            ...editingCourse.quiz!,
                                                                            questions: newQuestions
                                                                        }
                                                                    });
                                                                }}
                                                                className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                                                placeholder={`Option ${optIdx + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {editingCourse.quiz.questions.length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            No questions yet. Click "Add Question" to get started.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // Removed old inlined custom page editor. Now handled by CustomPageEditor subcomponent only.

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
                        <label className="block text-sm font-bold text-gray-700 mb-1">Profile Image</label>
                        <input 
                            type="text"
                            value={editingInstructor.imageUrl}
                            onChange={(e) => setEditingInstructor({...editingInstructor, imageUrl: e.target.value})}
                            className="w-full border rounded-xl p-3 text-sm font-mono text-gray-500 mb-2"
                            placeholder="Image URL or drag & drop image below"
                        />
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                            }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                
                                const files = e.dataTransfer.files;
                                if (files && files.length > 0) {
                                    const file = files[0];
                                    if (file.type.startsWith('image/')) {
                                        try {
                                            setIsUploading(true);
                                            const uploaded = await uploadImage(file, 'instructors');
                                            setEditingInstructor({
                                                ...editingInstructor,
                                                imageUrl: uploaded.url
                                            });
                                        } catch (error) {
                                            console.error('Error uploading instructor image:', error);
                                            alert('Error uploading image. Please try again.');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    } else {
                                        alert('Please upload an image file (PNG, JPG, GIF, etc.)');
                                    }
                                }
                            }}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            {isUploading ? (
                                <div className="text-gray-500 text-sm">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2"></div>
                                    Uploading image...
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="font-bold">Drag & drop image here</p>
                                    <p className="text-xs mt-1">or click to browse</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    const file = files[0];
                                    try {
                                        setIsUploading(true);
                                        const uploaded = await uploadImage(file, 'instructors');
                                        setEditingInstructor({
                                            ...editingInstructor,
                                            imageUrl: uploaded.url
                                        });
                                    } catch (error) {
                                        console.error('Error uploading instructor image:', error);
                                        alert('Error uploading image. Please try again.');
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }
                            }}
                            className="hidden"
                            id="instructor-image-upload"
                        />
                        <label
                            htmlFor="instructor-image-upload"
                            className="mt-2 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer"
                        >
                            Or click to browse files
                        </label>
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
                         
                         {/* Content Editor - Toggle between RichTextEditor and LayoutBuilder */}
                         <div>
                             <div className="flex justify-between items-center mb-2">
                                 <label className="block text-sm font-bold text-gray-700">Content</label>
                                 <div className="flex gap-2">
                                     <button
                                         onClick={() => {
                                             const useLayout = !editingPost.layoutBlocks;
                                             setEditingPost({
                                                 ...editingPost,
                                                 layoutBlocks: useLayout ? [] : undefined,
                                                 content: useLayout ? '' : (editingPost.content || '')
                                             });
                                         }}
                                         className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                                             editingPost.layoutBlocks 
                                                 ? 'bg-brand-purple text-white' 
                                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                         }`}
                                     >
                                         {editingPost.layoutBlocks ? 'Using Layout Builder' : 'Switch to Layout Builder'}
                                     </button>
                                 </div>
                             </div>
                             
                             {editingPost.layoutBlocks !== undefined ? (
                                 <LayoutBuilder
                                     blocks={editingPost.layoutBlocks || []}
                                     onChange={(blocks) => {
                                         // Convert layout blocks to HTML
                                         const html = blocks.map(block => {
                                             if (block.type === 'text-image') {
                                                 return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                                                     <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                     ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                 </div>`;
                                             } else if (block.type === 'image-text') {
                                                 return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                                                     ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                     <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                 </div>`;
                                             } else if (block.type === 'image-text-stack') {
                                                 return `<div class="image-text-stack">
                                                     ${block.imageUrl ? `<div class="image-container"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                     <div class="text-container prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                 </div>`;
                                             } else if (block.type === 'image-carousel') {
                                                 const images = block.images || [];
                                                 if (images.length === 0) return '';
                                                 return `<div class="my-6">
                                                     <div class="flex gap-4 overflow-x-auto pb-4">
                                                         ${images.map(img => `<div class="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover responsive-image" /></div>`).join('')}
                                                     </div>
                                                 </div>`;
                                             } else {
                                                 return `<div class="prose prose-lg max-w-none my-6">${block.text.replace(/\n/g, '<br>')}</div>`;
                                             }
                                         }).join('');
                                         
                                         setEditingPost({
                                             ...editingPost,
                                             layoutBlocks: blocks,
                                             content: html
                                         });
                                     }}
                                 />
                             ) : (
                                 <RichTextEditor 
                                    key={editingPost.id} // Re-mount if ID changes
                                    initialValue={editingPost.content}
                                    onChange={(html) => setEditingPost({...editingPost, content: html})}
                                 />
                             )}
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
                            {editingPost.coverImage && (
                                <div className="rounded-xl overflow-hidden h-40 bg-gray-100 mb-2 border border-gray-200">
                                    <img src={editingPost.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <input 
                                type="text"
                                value={editingPost.coverImage}
                                onChange={(e) => setEditingPost({...editingPost, coverImage: e.target.value})}
                                className="w-full border rounded-lg p-2 text-xs text-gray-500 font-mono mb-2"
                                placeholder="Image URL or drag & drop image below"
                            />
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                }}
                                onDrop={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                    
                                    const files = e.dataTransfer.files;
                                    if (files && files.length > 0) {
                                        const file = files[0];
                                        if (file.type.startsWith('image/')) {
                                            try {
                                                setIsUploading(true);
                                                const uploaded = await uploadImage(file, 'blog');
                                                setEditingPost({
                                                    ...editingPost,
                                                    coverImage: uploaded.url
                                                });
                                            } catch (error) {
                                                console.error('Error uploading cover image:', error);
                                                alert('Error uploading image. Please try again.');
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        } else {
                                            alert('Please upload an image file (PNG, JPG, GIF, etc.)');
                                        }
                                    }
                                }}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                {isUploading ? (
                                    <div className="text-gray-500 text-xs">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue mx-auto mb-1"></div>
                                        Uploading...
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-xs">
                                        <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                        <p className="font-bold">Drag & drop cover image</p>
                                        <p className="text-xs mt-0.5">or click to browse</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        const file = files[0];
                                        try {
                                            setIsUploading(true);
                                            const uploaded = await uploadImage(file, 'blog');
                                            setEditingPost({
                                                ...editingPost,
                                                coverImage: uploaded.url
                                            });
                                        } catch (error) {
                                            console.error('Error uploading cover image:', error);
                                            alert('Error uploading image. Please try again.');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }
                                }}
                                className="hidden"
                                id="blog-cover-upload"
                            />
                            <label
                                htmlFor="blog-cover-upload"
                                className="mt-1 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer"
                            >
                                Or click to browse files
                            </label>
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
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select
                                value={editingPost.category || ''}
                                onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                            >
                                <option value="">Select Category</option>
                                {localLookupLists.blogCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
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
    <>
      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PDFViewer
          url={viewingPdf.url}
          title={viewingPdf.title}
          onClose={() => setViewingPdf(null)}
        />
      )}

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
          <button onClick={() => handleTabChange('homepage')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'homepage' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Home className="w-4 h-4" /> Home
          </button>
          <button onClick={() => handleTabChange('pages')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'pages' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <FileText className="w-4 h-4" /> Pages
          </button>
          <button onClick={() => handleTabChange('courses')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'courses' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Briefcase className="w-4 h-4" /> Courses
          </button>
          <button onClick={() => handleTabChange('blog')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'blog' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <FileText className="w-4 h-4" /> Blog
          </button>
          <button onClick={() => handleTabChange('instructors')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'instructors' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <User className="w-4 h-4" /> Instructors
          </button>
          <button onClick={() => handleTabChange('settings')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={() => handleTabChange('inquiries')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'inquiries' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <Inbox className="w-4 h-4" /> {t.admin.inquiries}
          </button>
          <button onClick={() => handleTabChange('lookups')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'lookups' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <ListIcon className="w-4 h-4" /> Lookup Lists
          </button>
          <button onClick={() => handleTabChange('menu')} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'menu' ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <ListIcon className="w-4 h-4" /> Menu
          </button>
        </div>

        {/* --- Tab Content --- */}

        {activeTab === 'homepage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-brand-blue p-1.5 rounded-lg text-white"><Home className="w-5 h-5" /></div>
                            Homepage Content Editor
                        </h3>
                        <button 
                            onClick={handleSavePageContent}
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
                        >
                            <Save className="w-4 h-4" /> Save Homepage
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="border-b border-gray-100 pb-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Hero Section</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title Line 1</label>
                                    <input 
                                        value={localPageContent.hero.titleLine1}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, titleLine1: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title Line 2</label>
                                    <input 
                                        value={localPageContent.hero.titleLine2}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, titleLine2: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                    <textarea 
                                        value={localPageContent.hero.subtitle}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, subtitle: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Explore Button Text</label>
                                    <input 
                                        value={localPageContent.hero.exploreButton}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, exploreButton: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Trial Button Text</label>
                                    <input 
                                        value={localPageContent.hero.trialButton}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, trialButton: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="border-b border-gray-100 pb-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Section Headings</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Programs Heading</label>
                                        <input 
                                            value={localPageContent.sections.programs.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, programs: {...localPageContent.sections.programs, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Programs Subheading</label>
                                        <input 
                                            value={localPageContent.sections.programs.subheading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, programs: {...localPageContent.sections.programs, subheading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Heading</label>
                                        <input 
                                            value={localPageContent.sections.mentors.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, mentors: {...localPageContent.sections.mentors, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Subheading</label>
                                        <input 
                                            value={localPageContent.sections.mentors.subheading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, mentors: {...localPageContent.sections.mentors, subheading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Heading</label>
                                        <input 
                                            value={localPageContent.sections.gallery.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, gallery: {...localPageContent.sections.gallery, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Heading</label>
                                        <input 
                                            value={localPageContent.sections.contact.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Subheading</label>
                                        <input 
                                            value={localPageContent.sections.contact.subheading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, subheading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Address</label>
                                        <input 
                                            value={localPageContent.sections.contact.address}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, address: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Email</label>
                                        <input 
                                            value={localPageContent.sections.contact.email}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, email: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Us Section */}
                        <div className="border-t border-gray-200 pt-8">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">About Us Section</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Heading</label>
                                    <input 
                                        value={localPageContent.about?.heading || ''}
                                        onChange={(e) => setLocalPageContent({
                                            ...localPageContent,
                                            about: {
                                                ...(localPageContent.about || { subheading: '', content: '' }),
                                                heading: e.target.value
                                            }
                                        })}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Subheading</label>
                                    <input 
                                        value={localPageContent.about?.subheading || ''}
                                        onChange={(e) => setLocalPageContent({
                                            ...localPageContent,
                                            about: {
                                                ...(localPageContent.about || { heading: '', content: '' }),
                                                subheading: e.target.value
                                            }
                                        })}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-gray-700">About Content</label>
                                        <button
                                            onClick={() => {
                                                const useLayout = !localPageContent.about?.layoutBlocks;
                                                setLocalPageContent({
                                                    ...localPageContent,
                                                    about: {
                                                        ...(localPageContent.about || { heading: '', subheading: '', content: '' }),
                                                        layoutBlocks: useLayout ? [] : undefined,
                                                        content: useLayout ? '' : (localPageContent.about?.content || '')
                                                    }
                                                });
                                            }}
                                            className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                                                localPageContent.about?.layoutBlocks !== undefined
                                                    ? 'bg-brand-purple text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {localPageContent.about?.layoutBlocks !== undefined ? 'Using Layout Builder' : 'Switch to Layout Builder'}
                                        </button>
                                    </div>
                                    
                                    {localPageContent.about?.layoutBlocks !== undefined ? (
                                        <LayoutBuilder
                                            blocks={localPageContent.about.layoutBlocks || []}
                                            onChange={(blocks) => {
                                                // Convert layout blocks to HTML
                                                const html = blocks.map(block => {
                                                    if (block.type === 'text-image') {
                                                        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                                                            <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                            ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                        </div>`;
                                                    } else if (block.type === 'image-text') {
                                                        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                                                            ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                            <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                        </div>`;
                                                    } else if (block.type === 'image-text-stack') {
                                                        return `<div class="image-text-stack">
                                                            ${block.imageUrl ? `<div class="image-container"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                            <div class="text-container prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                        </div>`;
                                                    } else if (block.type === 'image-carousel') {
                                                        const images = block.images || [];
                                                        if (images.length === 0) return '';
                                                        return `<div class="my-6">
                                                            <div class="flex gap-4 overflow-x-auto pb-4">
                                                                ${images.map(img => `<div class="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover responsive-image" /></div>`).join('')}
                                                            </div>
                                                        </div>`;
                                                    } else {
                                                        return `<div class="prose prose-lg max-w-none my-6">${block.text.replace(/\n/g, '<br>')}</div>`;
                                                    }
                                                }).join('');
                                                
                                                setLocalPageContent({
                                                    ...localPageContent,
                                                    about: {
                                                        ...(localPageContent.about || { heading: '', subheading: '' }),
                                                        layoutBlocks: blocks,
                                                        content: html
                                                    }
                                                });
                                            }}
                                        />
                                    ) : (
                                        <RichTextEditor
                                            initialValue={localPageContent.about?.content || ''}
                                            onChange={(html) => setLocalPageContent({
                                                ...localPageContent,
                                                about: {
                                                    ...(localPageContent.about || { heading: '', subheading: '' }),
                                                    content: html
                                                }
                                            })}
                                            placeholder="Enter about us content..."
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Image URL</label>
                                    <input 
                                        type="text"
                                        value={localPageContent.about?.imageUrl || ''}
                                        onChange={(e) => setLocalPageContent({
                                            ...localPageContent,
                                            about: {
                                                ...(localPageContent.about || { heading: '', subheading: '', content: '' }),
                                                imageUrl: e.target.value
                                            }
                                        })}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/about-image.jpg"
                                    />
                                    {localPageContent.about?.imageUrl && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                                            <img src={localPageContent.about.imageUrl} alt="About Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section Backgrounds */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Section Backgrounds (image / GIF / MP4)</h4>
                            <p className="text-xs text-gray-500 mb-4">
                                Paste a direct URL or drag &amp; drop a PNG, JPG, GIF, or MP4 file. MP4 backgrounds will play as looping, muted videos.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Hero background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hero Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.hero || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    hero: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/hero-bg.png or .gif or .mp4"
                                    />
                                    {localPageContent.backgrounds?.hero && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.hero.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.hero} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.hero} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('hero', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.hero && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.hero || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            hero: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Programs background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Programs Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.programs || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    programs: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/programs-bg.png"
                                    />
                                    {localPageContent.backgrounds?.programs && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.programs.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.programs} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.programs} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('programs', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.programs && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.programs || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            programs: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Mentors background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.mentors || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    mentors: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/mentors-bg.png"
                                    />
                                    {localPageContent.backgrounds?.mentors && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.mentors.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.mentors} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.mentors} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('mentors', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.mentors && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.mentors || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            mentors: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Gallery background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.gallery || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    gallery: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/gallery-bg.gif"
                                    />
                                    {localPageContent.backgrounds?.gallery && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.gallery.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.gallery} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.gallery} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('gallery', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.gallery && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.gallery || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            gallery: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Contact background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Contact Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.contact || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    contact: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/contact-bg.mp4"
                                    />
                                    {localPageContent.backgrounds?.contact && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.contact.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.contact} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.contact} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('contact', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.contact && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.contact || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            contact: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* About background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Us Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.about || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    about: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/about-bg.png"
                                    />
                                    {localPageContent.backgrounds?.about && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.about.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.about} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.about} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('about', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.about && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.about || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            about: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Site Logo</h4>
                            <p className="text-xs text-gray-500 mb-4">
                                Upload a logo image to display in the top-left corner next to "NextElite Academy". Recommended: PNG with transparent background, max height 40px.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Logo URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.logo || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                logo: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        handleBackgroundUpload('logo', e.dataTransfer.files);
                                    }}
                                    className="mt-6 md:mt-0 text-xs border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors min-w-[200px]"
                                >
                                    Drag &amp; drop logo here
                                </div>
                            </div>
                            {localPageContent.logo && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-white p-4 inline-block">
                                    <img 
                                        src={localPageContent.logo} 
                                        alt="Logo Preview" 
                                        className="h-10 w-auto object-contain"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800">Gallery Images</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Images'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Or paste image URL here..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleImageUrlAdd((e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                        className="flex-1 border rounded-lg p-2 text-sm"
                                    />
                                    <button
                                        onClick={(e) => {
                                            const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                            if (input) {
                                                handleImageUrlAdd(input.value);
                                                input.value = '';
                                            }
                                        }}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
                                    >
                                        Add URL
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {localPageContent.galleryImages.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        draggable
                                        onDragStart={() => handleImageDragStart(idx)}
                                        onDragOver={handleImageDragOver}
                                        onDrop={(e) => handleImageDrop(e, idx)}
                                        className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-blue transition-all cursor-move"
                                    >
                                        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                            <GripVertical className="w-3 h-3" /> {idx + 1}
                                        </div>
                                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-32 object-cover" />
                                        <button
                                            onClick={() => handleImageDelete(idx)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

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

        {activeTab === 'pages' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Custom Pages</h3>
                            <p className="text-sm text-gray-600 mt-1">Manage custom pages for your website. Each page supports both English and Traditional Chinese.</p>
                        </div>
                        <button
                            onClick={() => {
                                const newPage: CustomPage = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    slug: '',
                                    translations: {
                                        en: { name: '', content: '', layoutBlocks: undefined },
                                        zh: { name: '', content: '', layoutBlocks: undefined }
                                    },
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                };
                                setEditingPage(newPage);
                            }}
                            className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
                        >
                            <Plus className="w-5 h-5" /> New Page
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {localCustomPages.map(page => (
                        <div key={page.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-4 group hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 truncate">{page.translations.en.name || page.translations.zh.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">/{page.slug}</p>
                                    <p className="text-xs text-gray-500 mt-2">Updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingPage(page)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (confirm('Delete this page?')) {
                                                const newPages = localCustomPages.filter(p => p.id !== page.id);
                                                setLocalCustomPages(newPages);
                                                if (onUpdateCustomPages) onUpdateCustomPages(newPages);
                                            }
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {editingPage && (
                    <CustomPageEditor
                        editingPage={editingPage}
                        setEditingPage={setEditingPage}
                        onSave={(page) => {
                            const isNew = !localCustomPages.find(p => p.id === page.id);
                            let newPages = [...localCustomPages];
                            if (isNew) {
                                newPages.push(page);
                            } else {
                                newPages = newPages.map(p => p.id === page.id ? page : p);
                            }
                            setLocalCustomPages(newPages);
                            if (onUpdateCustomPages) onUpdateCustomPages(newPages);
                            setEditingPage(null);
                        }}
                        currentCustomPages={localCustomPages}
                    />
                )}
            </div>
        )}

        {activeTab === 'menu' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Frontend Navigation Menu</h3>
                            <p className="text-sm text-gray-600 mt-1">Manage the main navigation menu. You can create submenus by selecting a parent item.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMenuEditingLang('en')}
                                className={`px-4 py-2 rounded-lg font-bold transition-colors ${menuEditingLang === 'en' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setMenuEditingLang('zh')}
                                className={`px-4 py-2 rounded-lg font-bold transition-colors ${menuEditingLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                繁體中文
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {currentMenuItems
                            .filter(item => !item.parentId) // Show only top-level items
                            .sort((a, b) => a.order - b.order)
                            .map(item => {
                                const children = currentMenuItems.filter(child => child.parentId === item.id).sort((a, b) => a.order - b.order);
                                return (
                                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={item.label}
                                                        onChange={(e) => {
                                                            const newItems = currentMenuItems.map(i => 
                                                                i.id === item.id ? { ...i, label: e.target.value } : i
                                                            );
                                                            setCurrentMenuItems(newItems);
                                                        }}
                                                        onBlur={() => {
                                                            if (onUpdateMenuItems) onUpdateMenuItems(currentMenuItems, menuEditingLang);
                                                        }}
                                                        className="font-bold text-gray-800 border rounded px-2 py-1 text-sm"
                                                    />
                                                    {children.length > 0 && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                                                            {children.length} submenu{children.length !== 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => {
                                                            const newItems = currentMenuItems.map(i => 
                                                                i.id === item.id ? { ...i, type: e.target.value as 'page' | 'link' | 'custom' } : i
                                                            );
                                                            setCurrentMenuItems(newItems);
                                                            if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                        }}
                                                        className="border rounded px-2 py-1"
                                                    >
                                                        <option value="page">Page (Custom Page Slug)</option>
                                                        <option value="link">Link (External URL)</option>
                                                        <option value="custom">Custom Route</option>
                                                    </select>
                                                    {item.type === 'page' ? (
                                                        <div className="relative w-full">
                                                            <input
                                                                type="text"
                                                                value={item.target}
                                                                onChange={(e) => {
                                                                    const newItems = currentMenuItems.map(i => 
                                                                        i.id === item.id ? { ...i, target: e.target.value } : i
                                                                    );
                                                                    setCurrentMenuItems(newItems);
                                                                }}
                                                                onBlur={() => {
                                                                    if (onUpdateMenuItems) onUpdateMenuItems(currentMenuItems, menuEditingLang);
                                                                }}
                                                                className="flex-1 border rounded px-2 py-1 text-xs font-mono"
                                                                placeholder="page-slug"
                                                                list={`slug-options-${menuEditingLang}`}
                                                            />
                                                            <datalist id={`slug-options-${menuEditingLang}`}>
                                                                {localCustomPages.map(page => (
                                                                    <option key={page.id} value={page.slug} />
                                                                ))}
                                                            </datalist>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={item.target}
                                                            onChange={(e) => {
                                                                const newItems = currentMenuItems.map(i => 
                                                                    i.id === item.id ? { ...i, target: e.target.value } : i
                                                                );
                                                                setCurrentMenuItems(newItems);
                                                            }}
                                                            onBlur={() => {
                                                                if (onUpdateMenuItems) onUpdateMenuItems(currentMenuItems, menuEditingLang);
                                                            }}
                                                            className="flex-1 border rounded px-2 py-1 text-xs font-mono"
                                                            placeholder={item.type === 'link' ? 'https://...' : '/route'}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="number"
                                                    value={item.order}
                                                    onChange={(e) => {
                                                        const newItems = currentMenuItems.map(i => 
                                                            i.id === item.id ? { ...i, order: parseInt(e.target.value) || 0 } : i
                                                        );
                                                        setCurrentMenuItems(newItems);
                                                        if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                    }}
                                                    className="w-16 border rounded px-2 py-1 text-xs text-center"
                                                    placeholder="Order"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newItems = currentMenuItems.map(i => 
                                                            i.id === item.id ? { ...i, visible: !i.visible } : i
                                                        );
                                                        setCurrentMenuItems(newItems);
                                                        if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                    }}
                                                    className={`text-xs px-3 py-1 rounded-lg font-bold ${item.visible ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'} hover:opacity-80`}
                                                >
                                                    {item.visible ? 'Visible' : 'Hidden'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this menu item and all its submenus?')) {
                                                            const newItems = currentMenuItems.filter(i => i.id !== item.id && i.parentId !== item.id);
                                                            setCurrentMenuItems(newItems);
                                                            if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                        }
                                                    }}
                                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Submenu Items */}
                                        {children.length > 0 && (
                                            <div className="bg-gray-100 border-t border-gray-200 p-3 space-y-2">
                                                {children.map(child => (
                                                    <div key={child.id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                                                        <span className="text-xs text-gray-500">└─</span>
                                                        <input
                                                            type="text"
                                                            value={child.label}
                                                            onChange={(e) => {
                                                                const newItems = currentMenuItems.map(i => 
                                                                    i.id === child.id ? { ...i, label: e.target.value } : i
                                                                );
                                                                setCurrentMenuItems(newItems);
                                                            }}
                                                            onBlur={() => {
                                                                if (onUpdateMenuItems) onUpdateMenuItems(currentMenuItems, menuEditingLang);
                                                            }}
                                                            className="flex-1 text-sm border rounded px-2 py-1"
                                                        />
                                                        <select
                                                            value={child.type}
                                                            onChange={(e) => {
                                                                const newItems = currentMenuItems.map(i => 
                                                                    i.id === child.id ? { ...i, type: e.target.value as 'page' | 'link' | 'custom' } : i
                                                                );
                                                                setCurrentMenuItems(newItems);
                                                                if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                            }}
                                                            className="text-xs border rounded px-2 py-1"
                                                        >
                                                            <option value="page">Page</option>
                                                            <option value="link">Link</option>
                                                            <option value="custom">Route</option>
                                                        </select>
                                                        <input
                                                            type="text"
                                                            value={child.target}
                                                            onChange={(e) => {
                                                                const newItems = currentMenuItems.map(i => 
                                                                    i.id === child.id ? { ...i, target: e.target.value } : i
                                                                );
                                                                setCurrentMenuItems(newItems);
                                                            }}
                                                            onBlur={() => {
                                                                if (onUpdateMenuItems) onUpdateMenuItems(currentMenuItems, menuEditingLang);
                                                            }}
                                                            className="w-32 text-xs border rounded px-2 py-1 font-mono"
                                                            placeholder="target"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={child.order}
                                                            onChange={(e) => {
                                                                const newItems = currentMenuItems.map(i => 
                                                                    i.id === child.id ? { ...i, order: parseInt(e.target.value) || 0 } : i
                                                                );
                                                                setCurrentMenuItems(newItems);
                                                                if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                            }}
                                                            className="w-12 text-xs border rounded px-1 py-1 text-center"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newItems = currentMenuItems.map(i => 
                                                                    i.id === child.id ? { ...i, visible: !i.visible } : i
                                                                );
                                                                setCurrentMenuItems(newItems);
                                                                if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                            }}
                                                            className={`text-xs px-2 py-1 rounded ${child.visible ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                                                        >
                                                            {child.visible ? '✓' : '✗'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Delete this submenu item?')) {
                                                                    const newItems = currentMenuItems.filter(i => i.id !== child.id);
                                                                    setCurrentMenuItems(newItems);
                                                                    if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                                }
                                                            }}
                                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newItem: MenuItem = {
                                                            id: Math.random().toString(36).substr(2, 9),
                                                            label: 'New Submenu Item',
                                                            type: 'custom',
                                                            target: '',
                                                            order: children.length,
                                                            visible: true,
                                                            parentId: item.id
                                                        };
                                                        const newItems = [...currentMenuItems, newItem];
                                                        setCurrentMenuItems(newItems);
                                                        if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                    }}
                                                    className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold hover:bg-gray-300 flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Submenu
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* Add Submenu Button (if no children) */}
                                        {children.length === 0 && (
                                            <div className="bg-gray-50 border-t border-gray-200 p-2">
                                                <button
                                                    onClick={() => {
                                                        const newItem: MenuItem = {
                                                            id: Math.random().toString(36).substr(2, 9),
                                                            label: 'New Submenu Item',
                                                            type: 'custom',
                                                            target: '',
                                                            order: 0,
                                                            visible: true,
                                                            parentId: item.id
                                                        };
                                                        const newItems = [...currentMenuItems, newItem];
                                                        setCurrentMenuItems(newItems);
                                                        if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                                                    }}
                                                    className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold hover:bg-gray-300 flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Submenu
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                    <button
                        onClick={() => {
                            const newItem: MenuItem = {
                                id: Math.random().toString(36).substr(2, 9),
                                label: 'New Menu Item',
                                type: 'custom',
                                target: '',
                                order: currentMenuItems.filter(i => !i.parentId).length,
                                visible: true
                            };
                            const newItems = [...currentMenuItems, newItem];
                            setCurrentMenuItems(newItems);
                            if (onUpdateMenuItems) onUpdateMenuItems(newItems, menuEditingLang);
                        }}
                        className="mt-4 bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4" /> Add Menu Item
                    </button>
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


        {activeTab === 'lookups' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-brand-blue p-1.5 rounded-lg text-white"><ListIcon className="w-5 h-5" /></div>
                            Lookup Lists Management
                        </h3>
                        <button 
                            onClick={handleSaveLookupLists}
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
                        >
                            <Save className="w-4 h-4" /> Save Lists
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Age Groups */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800">Age Groups</h4>
                                <button
                                    onClick={() => {
                                        const newItem = prompt('Enter new age group:');
                                        if (newItem && newItem.trim()) {
                                            setLocalLookupLists({
                                                ...localLookupLists,
                                                ageGroups: [...localLookupLists.ageGroups, newItem.trim()]
                                            });
                                        }
                                    }}
                                    className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {localLookupLists.ageGroups.map((age, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <input
                                            type="text"
                                            value={age}
                                            onChange={(e) => {
                                                const newAgeGroups = [...localLookupLists.ageGroups];
                                                newAgeGroups[idx] = e.target.value;
                                                setLocalLookupLists({
                                                    ...localLookupLists,
                                                    ageGroups: newAgeGroups
                                                });
                                            }}
                                            className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                                        />
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this age group?')) {
                                                    setLocalLookupLists({
                                                        ...localLookupLists,
                                                        ageGroups: localLookupLists.ageGroups.filter((_, i) => i !== idx)
                                                    });
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Categories */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800">Course Categories</h4>
                                <button
                                    onClick={() => {
                                        const newItem = prompt('Enter new category:');
                                        if (newItem && newItem.trim()) {
                                            setLocalLookupLists({
                                                ...localLookupLists,
                                                courseCategories: [...localLookupLists.courseCategories, newItem.trim()]
                                            });
                                        }
                                    }}
                                    className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {localLookupLists.courseCategories.map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <input
                                            type="text"
                                            value={cat}
                                            onChange={(e) => {
                                                const newCategories = [...localLookupLists.courseCategories];
                                                newCategories[idx] = e.target.value;
                                                setLocalLookupLists({
                                                    ...localLookupLists,
                                                    courseCategories: newCategories
                                                });
                                            }}
                                            className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                                        />
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this category?')) {
                                                    setLocalLookupLists({
                                                        ...localLookupLists,
                                                        courseCategories: localLookupLists.courseCategories.filter((_, i) => i !== idx)
                                                    });
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Blog Categories */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800">Blog Categories</h4>
                                <button
                                    onClick={() => {
                                        const newItem = prompt('Enter new blog category:');
                                        if (newItem && newItem.trim()) {
                                            setLocalLookupLists({
                                                ...localLookupLists,
                                                blogCategories: [...(localLookupLists.blogCategories || []), newItem.trim()]
                                            });
                                        }
                                    }}
                                    className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {(localLookupLists.blogCategories || []).map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <input
                                            type="text"
                                            value={cat}
                                            onChange={(e) => {
                                                const newCategories = [...(localLookupLists.blogCategories || [])];
                                                newCategories[idx] = e.target.value;
                                                setLocalLookupLists({
                                                    ...localLookupLists,
                                                    blogCategories: newCategories
                                                });
                                            }}
                                            className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                                        />
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this category?')) {
                                                    setLocalLookupLists({
                                                        ...localLookupLists,
                                                        blogCategories: (localLookupLists.blogCategories || []).filter((_, i) => i !== idx)
                                                    });
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Translations Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="bg-brand-blue p-1.5 rounded-lg text-white"><Languages className="w-5 h-5" /></div>
                        Translations
                    </h3>
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={() => setEditingLang('en')}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${editingLang === 'en' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setEditingLang('zh')}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${editingLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            繁體中文
                        </button>
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
                    <button
                        onClick={handleSaveTranslations}
                        className="mt-6 w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" /> Save Translations
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                </div>

                <div className="mt-4">
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
    </>
  );
};

export default CMSDashboard;    