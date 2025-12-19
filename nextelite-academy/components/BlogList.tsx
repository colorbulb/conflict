import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, Search, Filter, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface BlogListProps {
  posts: BlogPost[];
  categories?: string[];
  onReadMore?: (postId: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ posts, categories = [], onReadMore }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{t.blog.title}</h2>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-[200px]"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || searchQuery) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-semibold">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-bold">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="hover:bg-brand-blue/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 font-semibold underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} articles
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="mt-4 text-brand-blue hover:text-brand-purple font-semibold underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
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
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                   {post.category && (
                     <span className="bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                       {post.category}
                     </span>
                   )}
                   {post.tags.map((tag, i) => (
                     <span key={i} className="bg-white/90 backdrop-blur-sm text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                       {tag}
                     </span>
                   ))}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
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
        )}
      </div>
    </div>
  );
};

export default BlogList;