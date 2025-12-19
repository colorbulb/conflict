
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthGate from './components/AuthGate';
import AdminTags from './components/AdminTags';
import AdminVault from './components/AdminVault';
import PairingDashboard from './components/PairingDashboard';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const path = window.location.pathname;

let content: React.ReactElement;

if (path.startsWith('/admin/vault')) {
  content = (
    <React.StrictMode>
      <AuthGate>
        <AdminVault />
      </AuthGate>
    </React.StrictMode>
  );
} else if (path.startsWith('/admin')) {
  content = (
    <React.StrictMode>
      <AuthGate>
        <AdminTags />
      </AuthGate>
    </React.StrictMode>
  );
} else {
  content = (
    <React.StrictMode>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <AuthGate>
          <PairingDashboard />
        </AuthGate>
      </div>
    </React.StrictMode>
  );
}

root.render(content);

