import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, UserCircle, Loader2, AlertCircle, CheckCircle2, Stethoscope } from 'lucide-react';

import api from '../api';

export default function PatientDashboard() {
  const { logout } = useAuth(); 
  
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);

  // New State for Doctors
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!doctorId) {
      setStatusType('error');
      setStatusMessage('Please select a doctor.');
      return;
    }
    
    setLoading(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await api.post('/appointments/book', { 
        doctorId: parseInt(doctorId, 10), 
        startTime: new Date(appointmentDate).toISOString() 
      });

      if (response.status === 201 || response.status === 200) {
        setStatusType('success');
        setStatusMessage('Appointment successfully booked!');
        setDoctorId('');
        setAppointmentDate('');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setStatusType('conflict');
        setStatusMessage('This time slot is already booked. Please select another time.');
      } else if (err.response) {
        setStatusType('error');
        setStatusMessage(err.response.data.error || err.response.data.message || 'An error occurred while booking the appointment.');
      } else {
        setStatusType('error');
        setStatusMessage('Network error. Unable to reach the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Portal</h1>
            <p className="text-slate-500 mt-1">Book and manage your medical appointments.</p>
          </div>
          <button 
            onClick={logout}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
          >
            Sign out
          </button>
        </div>

        <div className="bg-white shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5 opacity-80" />
              Book a New Appointment
            </h2>
          </div>
          
          <div className="p-6 sm:p-8">
            {statusMessage && (
              <div 
                className={`mb-6 p-4 rounded-xl flex items-start border shadow-sm transition-all
                  ${statusType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
                  ${statusType === 'conflict' ? 'bg-red-50 border-red-200 text-red-800' : ''}
                  ${statusType === 'error' ? 'bg-orange-50 border-orange-200 text-orange-800' : ''}
                `}
              >
                {statusType === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 mr-3 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className={`h-5 w-5 mr-3 shrink-0 mt-0.5 ${statusType === 'conflict' ? 'text-red-500' : 'text-orange-500'}`} />
                )}
                <span className="font-medium text-sm leading-relaxed">{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select a Specialist</label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <select
                    required
                    disabled={fetchingDoctors}
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 appearance-none disabled:opacity-60"
                  >
                    <option value="" disabled>
                      {fetchingDoctors ? 'Loading doctors...' : '-- Choose a Doctor --'}
                    </option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id} disabled={!doc.isAvailable}>
                        {doc.user?.email} - {doc.specialization} {doc.isAvailable ? '(Available)' : '(Unavailable)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date & Time</label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="datetime-local"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || fetchingDoctors}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Confirm Appointment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
