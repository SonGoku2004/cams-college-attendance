import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

const ManageSubjects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects] = useState([
    { id: 1, name: 'Database Systems', code: 'CS301', department: 'Computer Science', semester: '3', teacher: 'John Teacher', students: 45 },
    { id: 2, name: 'Data Structures', code: 'CS201', department: 'Computer Science', semester: '2', teacher: 'Sarah Wilson', students: 50 },
    { id: 3, name: 'Web Development', code: 'CS401', department: 'Computer Science', semester: '4', teacher: 'John Teacher', students: 45 },
    { id: 4, name: 'Computer Networks', code: 'CS302', department: 'Computer Science', semester: '3', teacher: 'Mike Brown', students: 48 },
    { id: 5, name: 'Operating Systems', code: 'CS303', department: 'Computer Science', semester: '3', teacher: 'Lisa Davis', students: 45 },
  ]);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/hod')} className="hover:bg-purple-700 p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Manage Subjects</h1>
          </div>
          <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50">
            <FiPlus /> Add Subject
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject name or code..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Semester</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Teacher</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Students</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{subject.code}</td>
                  <td className="px-6 py-4 text-gray-600">{subject.name}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{subject.department}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{subject.semester}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{subject.teacher}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{subject.students}</td>
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

export default ManageSubjects;
