import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const [attendanceData] = useState([
    { subject: 'Data Structures', total: 45, present: 40, percentage: 89 },
    { subject: 'Database Systems', total: 42, present: 38, percentage: 90 },
    { subject: 'Web Development', total: 48, present: 35, percentage: 73 },
    { subject: 'Computer Networks', total: 40, present: 32, percentage: 80 },
    { subject: 'Operating Systems', total: 44, present: 30, percentage: 68 },
    { subject: 'Software Engineering', total: 38, present: 35, percentage: 92 },
  ]);

  const overallPercentage = Math.round(
    attendanceData.reduce((sum, sub) => sum + sub.percentage, 0) / attendanceData.length
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/student')} className="hover:bg-blue-700 p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">View Attendance</h1>
          </div>
          <button className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">
            <FiDownload /> Export
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Overall Attendance</h2>
            <span className={`text-3xl font-bold ${overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
              {overallPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${overallPercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Subject-wise Attendance</h3>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Total Classes</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Present</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Percentage</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((sub, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{sub.subject}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{sub.total}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{sub.present}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-semibold ${sub.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                      {sub.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sub.percentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.percentage >= 75 ? 'Good' : 'Low'}
                    </span>
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

export default ViewAttendance;
