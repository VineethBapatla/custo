// src/App.jsx
import { useState } from 'react';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState('client'); // 'client' or 'admin'

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Nexus Digital</span>
        </div>
        
        {/* Navigation Mode Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setView('client')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              view === 'client' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Public Site
          </button>
          <button
            onClick={() => setView('admin')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              view === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-10">
        {view === 'client' ? (
          <div className="max-w-6xl mx-auto px-6 pt-6 pb-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Custom Web Development
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Tailored Applications Built for High Performance
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                We engineer high-converting custom platforms, API integrations, and scalable client dashboards tailored to your exact workflow.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-sm text-gray-500">System Uptime</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">&lt; 100ms</p>
                  <p className="text-sm text-gray-500">API Response</p>
                </div>
              </div>
            </div>

            {/* Booking Form Card */}
            <div id="booking" className="w-full md:w-auto flex justify-center">
              <BookingForm />
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}
