import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiClock } from 'react-icons/fi';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('Database Systems');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([
    { id: 1, name: 'Jane Student', roll: 'S001', status: 'present' },
    { id: 2, name: 'John Doe', roll: 'S002', status: 'absent' },
    { id: 3, name: 'Alice Smith', roll: 'S003', status: 'present' },
    { id: 4, name: 'Bob Johnson', roll: 'S004', status: 'late' },
    { id: 5, name: 'Emma Davis', roll: 'S005', status: 'absent' },
  ]);

  const toggleAttendance = (id) => {
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.id === id) {
          const statusCycle = { present: 'absent', absent: 'late', late: 'present' };
          return { ...student, status: statusCycle[student.status] };
        }
        return student;
      })
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100';
    }
  };

  const saveAttendance = () => {
    console.log('Saving attendance:', students);
    alert('Attendance saved successfully!');
    navigate('/teacher');
  };

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/teacher')} className="hover:bg-green-700 p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Mark Attendance</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => markAll('present')} className="text-sm bg-green-700 px-3 py-1 rounded hover:bg-green-800">
              All Present
            </button>
            <button onClick={() => markAll('absent')} className="text-sm bg-red-700 px-3 py-1 rounded hover:bg-red-800">
              All Absent
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Database Systems</option>
                <option>Data Structures</option>
                <option>Web Development</option>
                <option>Computer Networks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Late</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{student.roll}</td>
                    <td className="px-6 py-4 text-gray-600">{student.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {student.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`p-2 rounded-lg ${
                          student.status === 'present' ? 'bg-green-50 text-green-600' :
                          student.status === 'absent' ? 'bg-red-50 text-red-600' :
                          'bg-yellow-50 text-yellow-600'
                        }`}
                        title="Click to cycle: Present -> Absent -> Late"
                      >
                        {student.status === 'present' ? <FiCheck /> : 
                         student.status === 'absent' ? <FiX /> : <FiClock />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => navigate('/teacher')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={saveAttendance}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
