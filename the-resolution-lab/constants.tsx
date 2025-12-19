
import React from 'react';

export const FEELING_TAGS = [
  'Overwhelmed', 'Ignored', 'Unappreciated', 'Anxious', 'Frustrated', 
  'Lonely', 'Judged', 'Insecure', 'Exhausted', 'Disconnected', 'Pressured'
];

export const NEED_TAGS = [
  'Quality Time', 'Physical Touch', 'Words of Affirmation', 'Acts of Service',
  'Validation', 'Respect', 'Autonomy', 'Safety', 'Transparency', 'Equality'
];

export const CATEGORY_TAGS = [
  'Chores', 'Finances', 'Family Time', 'Social Life', 'Personal Time', 
  'Communication', 'Parenting', 'Intimacy', 'Career', 'Health'
];

export const COMMON_SCENARIOS: Record<string, string[]> = {
  'Chores': ['The dishes were left in the sink', "The laundry hasn't been folded", 'Household management feels uneven'],
  'Finances': ['We spent over our budget', 'An unplanned purchase was made', 'Financial goals feel misaligned'],
  'Family Time': ['The weekend was too busy with relatives', "We haven't had a date night", 'Phone use is interrupting our time'],
  'Communication': ['I felt interrupted during our talk', 'The tone felt aggressive', 'A decision was made without me'],
};

export const Icons = {
  Peace: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dove"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Vault: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
  ),
  Switch: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-right"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
  ),
  Tag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.586 8.586a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-8.586-8.586z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  ),
  HarmonyLogo: () => (
    <div className="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 120 120" className="mb-3">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="1" />
            <stop offset="50%" stopColor="#86efac" stopOpacity="1" />
            <stop offset="100%" stopColor="#a3d9a5" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="url(#ringGradient)"/>
        <circle cx="60" cy="60" r="40" fill="#f0fdf4"/>
        <g>
          <path d="M 30 75 L 35 85 L 45 85 L 50 75 Z" fill="#3b82f6"/>
          <circle cx="40" cy="60" r="5" fill="#3b82f6"/>
        </g>
        <g>
          <path d="M 70 75 L 75 85 L 85 85 L 90 75 Z" fill="#84cc16"/>
          <circle cx="80" cy="60" r="5" fill="#84cc16"/>
        </g>
        <path d="M 50 75 Q 55 65 60 70 Q 65 65 70 75" stroke="#84cc16" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 52 77 Q 60 72 68 77" stroke="#84cc16" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-teal-800">HARMONY</h1>
        <p className="text-xs text-slate-500 mt-0.5">Resolve & Grow Together.</p>
      </div>
    </div>
  )
};
