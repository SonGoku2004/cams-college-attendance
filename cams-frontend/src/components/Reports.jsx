import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiDownload, FiTrendingUp, FiUsers, FiBook, FiSend } from 'react-icons/fi';

const Reports = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [sendingAlert, setSendingAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const lowAttendanceStudents = [
    { id: 1, name: 'Emma Davis', roll: 'S005', class: 'CS-2024', attendance: 65, email: 'emma@student.com', subjects: 3 },
    { id: 2, name: 'John Doe', roll: 'S002', class: 'CS-2024', attendance: 72, email: 'john@student.com', subjects: 2 },
    { id: 3, name: 'Bob Wilson', roll: 'S008', class: 'CS-2023', attendance: 68, email: 'bob@student.com', subjects: 4 },
  ];

  const exportReport = () => {
    alert('Report exported successfully!');
  };

  const sendAlert = async (student) => {
    setSendingAlert(true);
    setAlertMessage('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/notifications/send-alert`, {
        student_id: student.id,
        email: student.email,
        type: 'attendance',
        message: `Your attendance is ${student.attendance}%, which is below the required 75%. Please improve your attendance immediately.`
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAlertMessage(`Alert sent to ${student.name}`);
    } catch (err) {
      setAlertMessage(`Failed to send alert to ${student.name}`);
    } finally {
      setSendingAlert(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/hod')} className="hover:bg-purple-700 p-2 rounded">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Reports</h1>
          </div>
          <button 
            onClick={exportReport}
            className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50"
          >
            <FiDownload /> Export to Excel
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedReport('attendance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                selectedReport === 'attendance' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiTrendingUp /> Low Attendance
            </button>
            <button
              onClick={() => setSelectedReport('students')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                selectedReport === 'students' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiUsers /> Student List
            </button>
            <button
              onClick={() => setSelectedReport('subjects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                selectedReport === 'subjects' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiBook /> Subject Performance
            </button>
          </div>
        </div>

        {alertMessage && (
          <div className={`mb-4 p-3 rounded-lg ${alertMessage.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {alertMessage}
          </div>
        )}

        {selectedReport === 'attendance' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Students with Low Attendance (&lt;75%)</h2>
              <p className="text-gray-600 mt-1">Total: {lowAttendanceStudents.length} students (Director Alert: Revenue risk due to potential dropouts)</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Attendance</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Subjects Affected</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {lowAttendanceStudents.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{student.roll}</td>
                    <td className="px-6 py-4 text-gray-600">{student.name}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{student.class}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 font-semibold">{student.attendance}%</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{student.subjects}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => sendAlert(student)}
                        disabled={sendingAlert}
                        className="flex items-center gap-1 mx-auto px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50"
                      >
                        <FiSend size={14} /> Send Alert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'students' && (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600">Select "Export to Excel" to download complete student list with attendance data and fee status.</p>
          </div>
        )}

        {selectedReport === 'subjects' && (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600">Select "Export to Excel" to download subject-wise performance report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
