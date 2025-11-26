import React, { useState } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

interface BlogProps {
  onViewPost: (post: BlogPost) => void;
}

export const Blog: React.FC<BlogProps> = ({ onViewPost }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Insights</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Latest updates, educational tips, and thought leadership from the Nexus Academy team.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12 max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-full border border-slate-100 group">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 flex-1">{post.excerpt}</p>
                  <button 
                    onClick={() => onViewPost(post)}
                    className="mt-auto flex items-center text-primary font-bold text-sm hover:gap-2 transition-all"
                  >
                    Read Article <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p className="text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};