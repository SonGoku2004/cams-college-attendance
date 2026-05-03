import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiUpload, FiCheckCircle } from 'react-icons/fi';

const Assignments = () => {
  const navigate = useNavigate();
  const [isTeacher] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role === 'teacher' : false);  
  const [assignments] = useState([
    { id: 1, title: 'Database Design Project', subject: 'Database Systems', dueDate: '2026-05-15', status: 'pending', submissions: 18, total: 45 },
    { id: 2, title: 'Sorting Algorithms', subject: 'Data Structures', dueDate: '2026-05-10', status: 'submitted', grade: null },
    { id: 3, title: 'React Portfolio', subject: 'Web Development', dueDate: '2026-05-20', status: 'pending', submissions: 0, total: 45 },
    { id: 4, title: 'Network Topology', subject: 'Computer Networks', dueDate: '2026-05-08', status: 'late', grade: 'B+' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`text-white p-4 shadow-lg ${isTeacher ? 'bg-green-600' : 'bg-blue-600'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(isTeacher ? '/teacher' : '/student')} className="hover:bg-opacity-20 hover:bg-black p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Assignments</h1>
          </div>
          {isTeacher && (
            <button className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50">
              <FiPlus /> Create Assignment
            </button>
          )}
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow hover:shadow-md transition p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                {!isTeacher && (
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'late' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
              <p className="text-sm text-gray-500 mb-4">Due: {assignment.dueDate}</p>
              
              {isTeacher ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {assignment.submissions}/{assignment.total} submitted
                  </span>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    View All
                  </button>
                </div>
              ) : (
                <button className={`w-full py-2 rounded-lg font-medium text-sm ${
                  assignment.status === 'submitted' 
                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`} disabled={assignment.status === 'submitted'}>
                  {assignment.status === 'submitted' ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiCheckCircle /> Submitted {assignment.grade && `(Grade: ${assignment.grade})`}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FiUpload /> Submit Assignment
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
