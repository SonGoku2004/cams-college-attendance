import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiBook, FiClipboard, FiBell, FiLogOut, FiUsers, FiTrendingUp, FiSettings, FiDownload } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const HODPortal = () => {
  const [hod, setHOD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const attendanceData = [
    { name: 'Good (>75%)', value: 427, color: '#10b981' },
    { name: 'Borderline (60-75%)', value: 18, color: '#f59e0b' },
    { name: 'Critical (<60%)', value: 5, color: '#ef4444' }
  ];

  const departmentData = [
    { dept: 'CS', students: 150, attendance: 82 },
    { dept: 'IT', students: 120, attendance: 78 },
    { dept: 'ECE', students: 100, attendance: 85 },
    { dept: 'EEE', students: 80, attendance: 76 }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchHODData();
  }, [navigate]);

  const fetchHODData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/hods/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHOD(response.data);
    } catch (err) {
      console.error('Error fetching HOD data:', err);
      setError(err.response?.data?.message || 'Failed to load HOD profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HOD Portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchHODData}
            className="flex items-center gap-2 mx-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
              H
            </div>
            <h1 className="text-xl font-bold">HOD Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/hod/reports')}
              className="relative p-2 hover:bg-purple-700 rounded-full"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">8</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                {hod?.first_name?.[0] || 'H'}
              </div>
              <span className="hidden md:inline">{hod?.first_name || 'HOD'}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 bg-purple-700 px-3 py-1 rounded hover:bg-purple-800">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {hod?.first_name || 'HOD'}!</h2>
          <p className="text-gray-600">{hod?.department || 'Department'} Department Head</p>
        </div>

        {hod && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => navigate('/hod/students')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-purple-600">450</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FiUsers className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Across 12 classes</p>
              </div>

              <div 
                onClick={() => navigate('/hod/teachers')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Teachers</p>
                    <p className="text-3xl font-bold text-blue-600">28</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FiUser className="text-blue-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">{hod.department} department</p>
              </div>

              <div 
                onClick={() => navigate('/hod/reports')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Low Attendance</p>
                    <p className="text-3xl font-bold text-red-600">23</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <FiTrendingUp className="text-red-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Below 75% threshold</p>
              </div>

              <div 
                onClick={() => navigate('/hod/fees')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Dues</p>
                    <p className="text-3xl font-bold text-orange-600">₹1.2L</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FiDownload className="text-orange-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">23 students pending</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dept" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#8884d8" name="Avg Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                onClick={() => navigate('/hod/students')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <FiUsers className="text-purple-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Manage Students</h4>
                <p className="text-gray-600 text-sm">View, add, or update student records</p>
              </div>

              <div 
                onClick={() => navigate('/hod/teachers')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <FiUser className="text-blue-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Manage Teachers</h4>
                <p className="text-gray-600 text-sm">View, assign, or update teacher profiles</p>
              </div>

              <div 
                onClick={() => navigate('/hod/subjects')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-green-200"
              >
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <FiBook className="text-green-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Manage Subjects</h4>
                <p className="text-gray-600 text-sm">Create and assign subjects to teachers</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reports & Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => navigate('/hod/reports')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-orange-200"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                  <FiDownload className="text-orange-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Generate Reports</h4>
                <p className="text-gray-600 text-sm">Export attendance and performance reports</p>
              </div>

              <div 
                onClick={() => navigate('/hod/settings')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <FiSettings className="text-gray-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Settings</h4>
                <p className="text-gray-600 text-sm">Configure attendance thresholds and policies</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HODPortal;
