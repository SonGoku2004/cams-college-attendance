import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

const ManageStudents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState([
    { id: 1, name: 'Jane Student', roll: 'S001', class: 'CS-2024', semester: '3', attendance: 85, feeStatus: 'paid' },
    { id: 2, name: 'John Doe', roll: 'S002', class: 'CS-2024', semester: '3', attendance: 72, feeStatus: 'pending' },
    { id: 3, name: 'Alice Smith', roll: 'S003', class: 'CS-2024', semester: '3', attendance: 90, feeStatus: 'paid' },
    { id: 4, name: 'Bob Johnson', roll: 'S004', class: 'CS-2023', semester: '4', attendance: 88, feeStatus: 'paid' },
    { id: 5, name: 'Emma Davis', roll: 'S005', class: 'CS-2024', semester: '3', attendance: 65, feeStatus: 'partial' },
  ]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/hod')} className="hover:bg-purple-700 p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Manage Students</h1>
          </div>
          <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50">
            <FiPlus /> Add Student
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Class</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Semester</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Attendance</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Fee Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{student.roll}</td>
                  <td className="px-6 py-4 text-gray-600">{student.name}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{student.class}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{student.semester}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-semibold ${student.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.feeStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      student.feeStatus === 'pending' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <FiEdit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
