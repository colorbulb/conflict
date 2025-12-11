import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onBack }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 pb-20 pt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-brand-blue mb-8 transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> {t.blog.back}
        </button>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Image */}
          <div className="h-64 md:h-96 relative">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
               <div className="p-8 md:p-12 w-full">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                 </div>
                 <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">{post.title}</h1>
                 <div className="flex items-center text-white/90 text-sm space-x-6">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
               <div className="flex items-center">
                 <span className="font-bold text-gray-900 mr-2">NextElite Academy</span>
               </div>
               <button className="text-gray-400 hover:text-brand-blue transition-colors">
                 <Share2 className="w-6 h-6" />
               </button>
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPostDetail;