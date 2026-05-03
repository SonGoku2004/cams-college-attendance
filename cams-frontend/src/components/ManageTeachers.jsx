import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSearch, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';

const ManageTeachers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers] = useState([
    { 
      id: 1, name: 'John Teacher', employeeId: 'T001', department: 'Computer Science', 
      subjects: 4, students: 120, classesToday: 2, lastActive: '2 hours ago', attendanceRate: 94 
    },
    { 
      id: 2, name: 'Sarah Wilson', employeeId: 'T002', department: 'Computer Science', 
      subjects: 3, students: 95, classesToday: 3, lastActive: 'Just now', attendanceRate: 91 
    },
    { 
      id: 3, name: 'Mike Brown', employeeId: 'T003', department: 'Information Technology', 
      subjects: 5, students: 150, classesToday: 1, lastActive: '1 day ago', attendanceRate: 88 
    },
    { 
      id: 4, name: 'Lisa Davis', employeeId: 'T004', department: 'Computer Science', 
      subjects: 2, students: 80, classesToday: 0, lastActive: '3 days ago', attendanceRate: 96 
    },
  ]);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/hod')} className="hover:bg-purple-700 p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Manage Teachers</h1>
          </div>
          <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50">
            <FiPlus /> Add Teacher
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl shadow hover:shadow-md transition p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.employeeId}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <FiEdit size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <span className="font-medium">{teacher.department}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subjects:</span>
                  <span className="font-medium">{teacher.subjects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-medium">{teacher.students}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className="text-purple-600" size={14} />
                    <span>Classes Today: <strong>{teacher.classesToday}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-blue-600" size={14} />
                    <span>Last Active: <strong>{teacher.lastActive}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="text-green-600" size={14} />
                    <span>Attendance Rate: <strong className="text-green-600">{teacher.attendanceRate}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTeachers;
