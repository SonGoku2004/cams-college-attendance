import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiBook, FiClipboard, FiBell, FiLogOut, FiUsers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const TeacherPortal = () => {
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchTeacherData();
  }, [navigate]);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/teachers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacher(response.data);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
              T
            </div>
            <h1 className="text-xl font-bold">Teacher Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/teacher/assignments')}
              className="relative p-2 hover:bg-green-700 rounded-full"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                {teacher?.first_name?.[0] || 'T'}
              </div>
              <span className="hidden md:inline">{teacher?.first_name || 'Teacher'}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 bg-green-700 px-3 py-1 rounded hover:bg-green-800">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {teacher?.first_name || 'Teacher'}!</h2>
          <p className="text-gray-600">{teacher?.department || 'Department'}</p>
        </div>

        {teacher && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Classes Today</p>
                    <p className="text-3xl font-bold text-green-600">4</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FiBook className="text-green-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">2 pending attendance</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Employee ID</p>
                    <p className="text-xl font-bold text-gray-800">{teacher.employee_id}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FiUser className="text-blue-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">{teacher.department}</p>
              </div>

              <div 
                onClick={() => navigate('/teacher/assignments')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Assignments</p>
                    <p className="text-3xl font-bold text-purple-600">12</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FiClipboard className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">3 to grade</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Students</p>
                    <p className="text-3xl font-bold text-orange-600">120</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FiUsers className="text-orange-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Across 4 subjects</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => navigate('/teacher/mark-attendance')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-green-200"
              >
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <FiCheckCircle className="text-green-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Mark Attendance</h4>
                <p className="text-gray-600 text-sm">Record attendance for today's classes</p>
              </div>

              <div 
                onClick={() => navigate('/teacher/assignments')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <FiClipboard className="text-blue-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Create Assignment</h4>
                <p className="text-gray-600 text-sm">Add new assignments for students</p>
              </div>

              <div 
                onClick={() => navigate('/teacher/assignments')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <FiTrendingUp className="text-purple-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">View Reports</h4>
                <p className="text-gray-600 text-sm">Check class performance</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherPortal;
