import React from 'react';
import { Home, Briefcase, User, FileText, Inbox, Settings, List as ListIcon, Layout, Trophy } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'courses', label: 'Courses', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'instructors', label: 'Instructors', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox },
    { id: 'lookups', label: 'Lookups', icon: ListIcon },
    { id: 'menu', label: 'Menu', icon: Layout },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
