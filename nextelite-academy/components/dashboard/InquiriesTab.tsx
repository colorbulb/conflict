import React from 'react';
import { Submission } from '../../types';
import { CheckSquare } from 'lucide-react';

interface InquiriesTabProps {
  submissions: Submission[];
  t: any;
}

const InquiriesTab: React.FC<InquiriesTabProps> = ({ submissions, t }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.type}</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Name</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.contact}</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Course Interest</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.details}</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.date}</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{t.admin.status}</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(submission => (
                <tr 
                  key={submission.id} 
                  className={`border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                    submission.status === 'new' ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      submission.type === 'trial' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {submission.type === 'trial' ? 'Free Trial' : 'Contact'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{submission.name}</td>
                  <td className="p-4 text-gray-600 text-sm font-mono">{submission.contactInfo}</td>
                  <td className="p-4 text-gray-600 text-sm">{submission.courseInterest || 'N/A'}</td>
                  <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{submission.details}</td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(submission.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      submission.status === 'new' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {submission.status === 'new' && <CheckSquare className="w-3 h-3" />}
                      {submission.status === 'new' ? 'New' : 'Read'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiriesTab;
