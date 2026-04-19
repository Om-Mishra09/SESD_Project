import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserRoundCog, 
  CalendarDays, 
  Loader2, 
  AlertCircle, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import api from '../api';

export default function AdminDashboard() {
  const { logout } = useAuth();
  
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, recentActivity: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || 'Failed to securely fetch stats.');
        } else {
          setError('Network Error. Cannot connect to backend.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                System Overview
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
              Command Center
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic text-sm">Real-time health monitoring and system analytics.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <p className="text-xs font-bold text-slate-400 uppercase">Administrator</p>
              <p className="text-sm font-bold text-slate-900 tracking-tight">System Root</p>
            </div>
            <button 
              onClick={logout}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all duration-300 active:scale-95"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-5 rounded-3xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle className="h-6 w-6 mr-3 shrink-0" />
            <span className="font-bold text-sm tracking-tight">{error}</span>
          </div>
        )}

        {/* Top Cards Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Doctors Card */}
          <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 hover:shadow-indigo-100 hover:-translate-y-1.5 transition-all duration-500 group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <UserRoundCog className="h-24 w-24 text-indigo-900" />
             </div>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-50 p-4 rounded-3xl group-hover:bg-indigo-600 transition-colors duration-500">
                <UserRoundCog className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Total Specialists</p>
              {loading ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats.doctors}</p>
                  <span className="text-xs font-bold text-emerald-500">+2 this month</span>
                </div>
              )}
            </div>
          </div>

          {/* Patients Card */}
          <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 hover:shadow-emerald-100 hover:-translate-y-1.5 transition-all duration-500 group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Users className="h-24 w-24 text-emerald-900" />
             </div>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-50 p-4 rounded-3xl group-hover:bg-emerald-600 transition-colors duration-500">
                <Users className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Active Patients</p>
              {loading ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats.patients}</p>
                  <span className="text-xs font-bold text-emerald-500">Live system</span>
                </div>
              )}
            </div>
          </div>

          {/* Appointments Card */}
          <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 hover:shadow-blue-100 hover:-translate-y-1.5 transition-all duration-500 group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <CalendarDays className="h-24 w-24 text-blue-900" />
             </div>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-4 rounded-3xl group-hover:bg-blue-600 transition-colors duration-500">
                <CalendarDays className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Total Orders</p>
              {loading ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats.appointments}</p>
                  <span className="text-xs font-bold text-blue-500">Scheduled</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Recent Activity Table */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent System Activity</h2>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All Logs</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Specialist</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Byte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-2 w-32 bg-slate-100 rounded"></div></td>
                      <td className="px-8 py-6"><div className="h-2 w-48 bg-slate-100 rounded"></div></td>
                      <td className="px-8 py-6"><div className="h-2 w-32 bg-slate-100 rounded"></div></td>
                      <td className="px-8 py-6"><div className="h-6 w-20 bg-slate-50 rounded-full"></div></td>
                    </tr>
                  ))
                ) : stats.recentActivity?.length > 0 ? (
                  stats.recentActivity.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-300" />
                          <span className="text-sm font-bold text-slate-700">
                            {new Date(app.startTime).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight">{app.patientEmail}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: {app.patientId}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">Dr</div>
                            <span className="text-sm font-bold text-slate-700">{app.doctorEmail}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm
                          ${app.status === 'SCHEDULED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}
                        `}>
                          <div className={`h-1.5 w-1.5 rounded-full ${app.status === 'SCHEDULED' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center text-slate-400 font-bold italic">
                      Zero system activity detected in target range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Info Branding */}
        <div className="pt-8 text-center flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
              <CheckCircle2 className="h-4 w-4 text-white" />
              <span className="text-xs font-black text-white uppercase tracking-widest tracking-widest">MediCore Enterprise Integrity Verified</span>
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-relaxed">
             Secure Node: {window.location.hostname} • Engine: MediCore V1.4.2 • Status: Production Optimized
           </p>
        </div>

      </div>
    </div>
  );
}
