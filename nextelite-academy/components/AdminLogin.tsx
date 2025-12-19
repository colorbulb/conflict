import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'adminpw') {
      // Save login state to localStorage for persistence
      localStorage.setItem('adminLoggedIn', 'true');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-brand-blue w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">CMS Login</h2>
          <p className="text-gray-500 text-sm">NextElite Academy Administration</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">
           Credentials: admin / adminpw
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
