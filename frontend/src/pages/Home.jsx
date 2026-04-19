import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ShieldCheck, HeartPulse, ActivitySquare, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header / Logo Only */}
      <nav className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 flex justify-center sm:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200/50">
            <ActivitySquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">MediCore</span>
        </div>
      </nav>

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        
        {/* Subtle decorative element */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Health OS V1.0</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6 max-w-4xl">
          Unified Healthcare. <br/>
          <span className="text-indigo-600">Simplified Operations.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mb-12 leading-relaxed">
          The all-in-one command center for modern medical teams. Secure patient scheduling, 
          record management, and administrative insights in one unified workspace.
        </p>

        {/* Focused CTA Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          
          <button 
            onClick={() => navigate('/login')}
            className="group relative flex flex-col items-center gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:border-indigo-200 hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500"
          >
            <div className="bg-indigo-50 p-5 rounded-[2rem] group-hover:bg-indigo-600 transition-colors duration-500">
              <HeartPulse className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 tracking-tight">Patient Login</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Appointment Center</p>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-slate-200 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="group relative flex flex-col items-center gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:border-blue-200 hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-500"
          >
            <div className="bg-blue-50 p-5 rounded-[2rem] group-hover:bg-blue-600 transition-colors duration-500">
              <Stethoscope className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 tracking-tight">Doctor Portal</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Clinical Rounds</p>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-slate-200 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="group relative flex flex-col items-center gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:border-slate-900 hover:shadow-slate-300 hover:-translate-y-2 transition-all duration-500"
          >
            <div className="bg-slate-50 p-5 rounded-[2rem] group-hover:bg-slate-900 transition-colors duration-500">
              <ShieldCheck className="h-8 w-8 text-slate-900 group-hover:text-white transition-colors duration-500" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 tracking-tight">Admin Access</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">System Root</p>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
          </button>

        </div>

        {/* Footer info */}
        <div className="mt-20 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Secure & Compliant Healthcare Infrastructure
        </div>
      </main>
    </div>
  );
}
