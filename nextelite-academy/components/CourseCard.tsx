import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Course } from '../types';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface CourseCardProps {
  course: Course;
  onViewDetails?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      layout
      className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-brand-blue transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2 hover:shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${course.color} p-6 flex items-center justify-between`}>
        <h3 className="text-2xl font-bold text-white font-display">{course.title}</h3>
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm shadow-inner">
          {course.icon}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(course.ageGroup) ? course.ageGroup.map((age, idx) => (
            <span key={idx} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              {age}
            </span>
          )) : (
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              {course.ageGroup}
            </span>
          )}
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-auto space-y-4">
          
          <Link
            to={`/courses/${course.id}`}
            onClick={() => onViewDetails?.(course.id)}
            className="w-full bg-brand-blue/10 text-brand-blue font-bold py-3 rounded-xl hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center group"
          >
            {t.course.learnMore} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-gray-600 font-semibold hover:text-gray-800 text-sm focus:outline-none transition-colors"
            >
              {isExpanded ? t.course.outlineHide : t.course.outlineShow}
              {isExpanded ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4 mt-2 bg-blue-50 p-4 rounded-xl text-sm">
                  {course.outline.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  {course.outline.length > 3 && <li className="list-none text-gray-400 italic text-xs mt-1">+ {course.outline.length - 3} {t.course.modules}</li>}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
