import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Search, Instagram, Facebook, Heart } from 'lucide-react';

export const Blog = ({ onViewPost, posts, socialFeed }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nexus Insights</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Expert analysis on education, AI technology, and competitive debate strategies.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        {/* Search */}
        <div className="bg-white p-2 rounded-2xl shadow-xl mb-16 max-w-2xl mx-auto flex items-center border border-slate-100">
            <Search className="ml-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl focus:outline-none text-slate-700 placeholder-slate-400"
            />
            <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition">
                Search
            </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition duration-500 flex flex-col h-full border border-slate-100 group cursor-pointer" onClick={() => onViewPost(post)}>
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition z-10"></div>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded shadow-sm z-20 uppercase tracking-wide">
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition leading-tight">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Read Article <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p className="text-xl font-medium">No articles found matching your search.</p>
            </div>
          )}
        </div>

        {/* Social Media Feed Section */}
        {socialFeed && socialFeed.length > 0 && (
          <div className="border-t border-slate-200 pt-16">
            <div className="flex items-center justify-center gap-3 mb-10">
              <Instagram size={28} className="text-primary" />
              <h2 className="text-3xl font-bold text-slate-900">@NexusEliteLife</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialFeed.map(post => (
                <div key={post.id} className="relative group overflow-hidden rounded-xl aspect-square bg-slate-100 cursor-pointer">
                  <img 
                    src={post.image} 
                    alt="Social media post" 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-white flex items-center gap-2 font-bold">
                       <Heart size={20} fill="white" /> {post.likes}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-slate-900">
                    {post.type === 'instagram' ? <Instagram size={14} /> : <Facebook size={14} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
               <button className="text-sm font-bold text-slate-500 hover:text-primary transition">Follow us on Social Media</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};