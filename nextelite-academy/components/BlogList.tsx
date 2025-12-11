import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface BlogListProps {
  posts: BlogPost[];
  onReadMore?: (postId: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ posts, onReadMore }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{t.blog.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                   {post.tags.map((tag, i) => (
                     <span key={i} className="bg-white/90 backdrop-blur-sm text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                       {tag}
                     </span>
                   ))}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {post.author}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <Link 
                  to={`/blog/${post.id}`}
                  onClick={() => onReadMore?.(post.id)}
                  className="mt-auto w-full border border-brand-blue text-brand-blue font-bold py-3 rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center group/btn"
                >
                  {t.blog.readMore} <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;