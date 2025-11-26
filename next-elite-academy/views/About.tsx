import React from 'react';
import { TEAM } from '../constants';
import { Target, Users, Zap } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nexus Academy</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">We are educators, innovators, and mentors dedicated to shaping the minds of the future.</p>
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Our Mission</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              At Nexus Academy, we believe that the traditional curriculum is just the starting point. In an increasingly complex world driven by artificial intelligence and rapid information exchange, students need more than just rote memorization.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our mission is to equip middle and high school students with the "Meta-Skills" of learning: <strong>Logic</strong> to analyze truth, <strong>Debate</strong> to articulate vision, and <strong>AI Literacy</strong> to harness the tools of tomorrow.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                <Target className="text-primary mb-2" size={24} />
                <span className="font-bold text-slate-800">Precision</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                <Users className="text-primary mb-2" size={24} />
                <span className="font-bold text-slate-800">Community</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                <Zap className="text-primary mb-2" size={24} />
                <span className="font-bold text-slate-800">Innovation</span>
              </div>
            </div>
          </div>
          <div className="relative">
             <img src="https://picsum.photos/600/500?random=30" alt="Classroom discussion" className="rounded-2xl shadow-xl w-full" />
             <div className="absolute -bottom-6 -left-6 bg-accent p-6 rounded-lg hidden md:block">
               <p className="text-slate-900 font-bold text-2xl">15+ Years</p>
               <p className="text-slate-800 text-sm">Of Educational Excellence</p>
             </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Meet Our Faculty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-2 transition duration-300">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-indigo-50" 
                />
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
