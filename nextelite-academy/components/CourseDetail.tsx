import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';
import { ArrowLeft, Check, Download, Calendar, Eye } from 'lucide-react';
import QuizModule from './QuizModule';
import { useLanguage } from './LanguageContext';
import PDFViewer from './PDFViewer';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onEnroll: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onEnroll }) => {
  const { t } = useLanguage();
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [viewingPdfTitle, setViewingPdfTitle] = useState<string>('');

  const handleOpenPdf = (url: string, title: string) => {
    setViewingPdf(url);
    setViewingPdfTitle(title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-gray-50 pb-20 pt-24"
    >
      {/* PDF Modal */}
      <PDFViewer 
        url={viewingPdf} 
        title={viewingPdfTitle} 
        onClose={() => setViewingPdf(null)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-brand-blue mb-6 transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> {t.course.back}
        </button>

        {/* Header Section */}
        <div className={`rounded-3xl p-8 md:p-12 text-white mb-10 shadow-lg ${course.color} relative overflow-hidden`}>
           <div className="absolute top-0 right-0 p-10 opacity-20">
             <div className="transform scale-150">
                {/* Simplified Icon handling for detail view if icon is string */}
                {/* In a real app we'd map this, for now we skip re-rendering the string icon or use a generic one if needed */}
             </div>
           </div>
           <div className="relative z-10 max-w-3xl">
             <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-bold mb-4 backdrop-blur-md">
                {course.ageGroup}
             </span>
             <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{course.title}</h1>
             <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8">
               {course.description}
             </p>
             <button 
               onClick={onEnroll}
               className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-transform hover:scale-105 shadow-md"
             >
               {t.course.enrollBtn}
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section className="bg-white p-8 rounded-3xl shadow-sm">
               <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">{t.course.overview}</h2>
               <p className="text-gray-600 leading-relaxed mb-6">
                 {course.fullDescription || course.description}
               </p>
               
               <h3 className="font-bold text-gray-800 mb-4 text-lg">{t.course.whatToLearn}</h3>
               <ul className="space-y-3">
                 {course.outline.map((item, i) => (
                   <li key={i} className="flex items-start text-gray-600">
                     <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                     {item}
                   </li>
                 ))}
               </ul>
            </section>

            {/* Gallery */}
            {course.galleryImages && (
              <section>
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">{t.course.gallery}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.galleryImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`Class ${idx}`} className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-48 object-cover" />
                  ))}
                </div>
              </section>
            )}

            {/* Quiz Section */}
            {course.quiz && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">{t.course.tryIt}</h2>
                  <p className="text-gray-600">{t.course.tryItSub}</p>
                </div>
                <QuizModule quiz={course.quiz} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
               <h3 className="text-xl font-bold text-gray-800 mb-4">{t.course.details}</h3>
               
               <div className="space-y-4 mb-6">
                 <div className="flex items-center text-gray-600">
                   <Calendar className="w-5 h-5 mr-3 text-brand-blue" />
                   <span>{t.course.duration}</span>
                 </div>
                 <div className="flex items-center text-gray-600">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                   <span>{t.course.level}</span>
                 </div>
               </div>

               <hr className="border-gray-100 my-4" />

               <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">{t.course.downloads}</h4>
               <div className="space-y-3">
                 {course.attachments.map((file, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => handleOpenPdf(file.url, file.name)}
                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group"
                   >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <Eye className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-gray-600 font-medium truncate">{file.name}</span>
                      </div>
                      <span className="text-xs text-brand-blue font-bold whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity">{t.course.view}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;