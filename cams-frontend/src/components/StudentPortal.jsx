import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiBook, FiClipboard, FiBell, FiLogOut, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const StudentPortal = () => {
  const [student, setStudent] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(82);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchStudentData();
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && token.startsWith('demo-')) {
        setStudent({ id: 3, first_name: 'Jane', last_name: 'Doe', email: 'student@cams.com', roll_number: 'S001', class: 'CS-2024', semester: 4, fee_status: 'paid' });
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/students/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(response.data);
    } catch (err) {
      console.error('Error fetching student data:', err);
      setStudent({ id: 3, first_name: 'Jane', last_name: 'Doe', email: 'student@cams.com', roll_number: 'S001', class: 'CS-2024', semester: 4, fee_status: 'paid' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
              S
            </div>
            <h1 className="text-xl font-bold">Student Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/student/attendance')} 
              className="relative p-2 hover:bg-blue-700 rounded-full"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                {student?.first_name?.[0] || 'S'}
              </div>
              <span className="hidden md:inline">{student?.first_name || 'Student'}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {student?.first_name || 'Student'}!</h2>
          <p className="text-gray-600">Here's your attendance overview</p>
        </div>

        {student && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => navigate('/student/attendance')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Attendance</p>
                    <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FiTrendingUp className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Roll Number</p>
                    <p className="text-xl font-bold text-gray-800">{student.roll_number}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FiUser className="text-green-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">{student.class} • Sem {student.semester}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Subjects</p>
                    <p className="text-3xl font-bold text-purple-600">6</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FiBook className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Enrolled this semester</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Fee Status</p>
                    <p className={`text-xl font-bold ${student.fee_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {student.fee_status.toUpperCase()}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <FiDollarSign className="text-yellow-600" size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Last updated: Today</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => navigate('/student/attendance')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <FiClipboard className="text-blue-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">View Attendance</h4>
                <p className="text-gray-600 text-sm">Check subject-wise attendance records</p>
              </div>

              <div 
                onClick={() => navigate('/student/assignments')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-green-200"
              >
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <FiBook className="text-green-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Assignments</h4>
                <p className="text-gray-600 text-sm">View and submit pending assignments</p>
              </div>

              <div 
                onClick={() => navigate('/student/attendance')}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <FiBell className="text-purple-600" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
                <p className="text-gray-600 text-sm">3 new alerts for low attendance</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
