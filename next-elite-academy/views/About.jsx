import React from 'react';
import { Target, Users, Zap } from 'lucide-react';

export const About = ({ content, team }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-secondary text-white py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.title}</h1>
          <p className="text-xl text-slate-400">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">{content.missionTitle}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
              {content.missionText1}
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              {content.missionText2}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-4">
                   <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Precision Thinking</h4>
                  <p className="text-sm text-slate-600">Eliminating cognitive bias and fuzzy reasoning.</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-amber-100 text-accent rounded-full flex items-center justify-center mr-4">
                   <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Collaborative Growth</h4>
                  <p className="text-sm text-slate-600">Learning through structured discourse and debate.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-primary rounded-2xl transform rotate-3 translate-x-2 translate-y-2 opacity-10"></div>
             <img src="https://picsum.photos/600/700?random=30" alt="Classroom discussion" className="rounded-2xl shadow-2xl w-full relative z-10" />
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content.facultyTitle}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{content.facultyText}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center hover:shadow-xl hover:-translate-y-2 transition duration-300">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-110"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white" 
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-4 uppercase tracking-wider">{member.role}</p>
                <p className="text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
