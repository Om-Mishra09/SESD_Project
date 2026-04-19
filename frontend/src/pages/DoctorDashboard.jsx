import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, UserSearch, FileText, Loader2, Save, Power } from 'lucide-react';

import api from '../api';

export default function DoctorDashboard() {
  const { logout } = useAuth();
  
  // Status State
  const [isAvailable, setIsAvailable] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  // Search Records State
  const [patientId, setPatientId] = useState('');
  const [records, setRecords] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // New State for Patients Dropdown
  const [patientsList, setPatientsList] = useState([]);
  const [fetchingPatients, setFetchingPatients] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        setPatientsList(response.data);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      } finally {
        setFetchingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  // Update Record State
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const toggleStatus = async () => {
    setStatusLoading(true);
    try {
      await api.patch('/doctors/status', { isAvailable: !isAvailable });
      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSearchRecords = async (e) => {
    e.preventDefault();
    if (!patientId.trim()) return;
    
    setSearchLoading(true);
    setSearchError(null);
    setRecords([]);
    setUpdateMessage(null);
    setEditingRecordId(null);

    try {
      const response = await api.get(`/records/patient/${patientId}`);
      const result = response.data;
      
      // Handle the backend envelope { message, data: [] }
      const fetchedRecords = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      console.log('Fetched Records Payload:', fetchedRecords);
      setRecords(fetchedRecords);

      if (fetchedRecords.length === 0) {
        setSearchError('No appointments or records found for this patient.');
      }
    } catch (err) {
      if (err.response) {
        setSearchError(err.response.data.message || 'No records found for this patient.');
      } else {
        setSearchError('Network error while fetching patient records.');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const startEditing = (record) => {
    setEditingRecordId(record.medicalRecord?.id);
    setEditDiagnosis(record.medicalRecord?.diagnosis || '');
    setEditNotes(record.medicalRecord?.prescriptionNotes || '');
    setUpdateMessage(null);
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage(null);

    try {
      await api.put(`/records/${editingRecordId}`, {
        diagnosis: editDiagnosis,
        prescriptionNotes: editNotes
      });

      setUpdateMessage({ type: 'success', text: 'Record updated successfully!' });
      
      // Update local list
      setRecords(records.map(r => 
        (r.medicalRecord?.id === editingRecordId) 
          ? { ...r, medicalRecord: { ...r.medicalRecord, diagnosis: editDiagnosis, prescriptionNotes: editNotes } } 
          : r
      ));
      setEditingRecordId(null);
    } catch (err) {
      if (err.response) {
        setUpdateMessage({ type: 'error', text: err.response.data.message || 'Failed to update record.' });
      } else {
        setUpdateMessage({ type: 'error', text: 'Network error. Update failed.' });
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
              <Stethoscope className="mr-3 h-8 w-8 text-primary-600" />
              Doctor Portal
            </h1>
            <p className="text-slate-500 mt-1">Manage your availability and patient medical files.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleStatus}
              disabled={statusLoading}
              className={`relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm border
                ${isAvailable 
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' }
                disabled:opacity-50
              `}
            >
              {statusLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Power className={`h-4 w-4 mr-2 ${isAvailable ? 'text-green-600' : 'text-red-600'}`} />
              )}
              {isAvailable ? 'Status: Available' : 'Status: Unavailable'}
            </button>

            <button 
              onClick={logout}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Search Patient */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow-xl shadow-slate-200/40 rounded-2xl p-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <UserSearch className="mr-2 h-5 w-5 text-slate-400" />
                Find Patient
              </h2>
              <form onSubmit={handleSearchRecords} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Patient</label>
                  <select
                    required
                    disabled={fetchingPatients}
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 transition-all disabled:opacity-60"
                  >
                    <option value="" disabled>
                      {fetchingPatients ? 'Loading patients...' : '-- Choose a Patient --'}
                    </option>
                    {patientsList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.email} (ID: {p.id})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-all"
                >
                  {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search Records'}
                </button>
              </form>

              {searchError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm">
                  {searchError}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Records Display & Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl shadow-slate-200/40 rounded-2xl p-6 border border-slate-100 min-h-[400px]">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary-500" />
                Medical Records
              </h2>

              {updateMessage && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium
                  ${updateMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}
                  border shadow-sm
                `}>
                  {updateMessage.text}
                </div>
              )}

              {records.length === 0 && !searchLoading && !searchError && (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <UserSearch className="h-12 w-12 mb-3 text-slate-200" />
                  <p>Search for a patient to view and update their records.</p>
                </div>
              )}

              {records.length > 0 && (
                <div className="space-y-6">
                  {records.map((record) => {
                    // Normalize data structure: The backend returns Appointments with nested medicalRecord
                    const appointmentId = record?.id || record?.appointmentId;
                    const startTime = record?.startTime || record?.appointment?.startTime;
                    const status = record?.status || record?.appointment?.status || 'UNKNOWN';
                    
                    const medRecord = record?.medicalRecord || (record?.diagnosis ? record : {});
                    const id = medRecord?.id;
                    const isEditing = editingRecordId === id && id;

                    return (
                      <div key={appointmentId || Math.random()} className={`p-5 rounded-2xl border transition-all ${isEditing ? 'border-primary-300 bg-primary-50/30 shadow-md shadow-primary-100/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        {isEditing ? (
                          <form onSubmit={handleUpdateRecord} className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diagnosis</label>
                              <input
                                type="text"
                                required
                                value={editDiagnosis}
                                onChange={(e) => setEditDiagnosis(e.target.value)}
                                className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prescription Notes</label>
                              <textarea
                                required
                                rows={3}
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
                              />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setEditingRecordId(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={updateLoading}
                                className="flex items-center px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                              >
                                {updateLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                  Appointment: {startTime ? new Date(startTime).toLocaleDateString() : 'N/A'} {startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </h3>
                                <p className="text-slate-900 font-mono text-sm mt-0.5">Status: {status}</p>
                              </div>
                              <button
                                onClick={() => startEditing(record)}
                                disabled={!id}
                                className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 hover:border-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit Record
                              </button>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Diagnosis</h4>
                                <p className="text-slate-800 text-sm">{medRecord.diagnosis || 'None provided'}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Prescription Notes</h4>
                                <p className="text-slate-800 text-sm whitespace-pre-wrap">{medRecord.prescriptionNotes || 'None provided'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
