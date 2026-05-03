import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import HODPortal from './components/HODPortal';
import ViewAttendance from './components/ViewAttendance';
import MarkAttendance from './components/MarkAttendance';
import Assignments from './components/Assignments';
import ManageStudents from './components/ManageStudents';
import ManageTeachers from './components/ManageTeachers';
import ManageSubjects from './components/ManageSubjects';
import Reports from './components/Reports';
import Settings from './components/Settings';
import FeeManagement from './components/FeeManagement';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hod" 
            element={
              <ProtectedRoute allowedRoles={['hod']}>
                <HODPortal />
              </ProtectedRoute>
            } 
          />
          <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><ViewAttendance /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><Assignments /></ProtectedRoute>} />
          <Route path="/teacher/mark-attendance" element={<ProtectedRoute allowedRoles={['teacher']}><MarkAttendance /></ProtectedRoute>} />
          <Route path="/teacher/assignments" element={<ProtectedRoute allowedRoles={['teacher']}><Assignments /></ProtectedRoute>} />
          <Route path="/hod/students" element={<ProtectedRoute allowedRoles={['hod']}><ManageStudents /></ProtectedRoute>} />
          <Route path="/hod/teachers" element={<ProtectedRoute allowedRoles={['hod']}><ManageTeachers /></ProtectedRoute>} />
          <Route path="/hod/subjects" element={<ProtectedRoute allowedRoles={['hod']}><ManageSubjects /></ProtectedRoute>} />
          <Route path="/hod/reports" element={<ProtectedRoute allowedRoles={['hod']}><Reports /></ProtectedRoute>} />
          <Route path="/hod/settings" element={<ProtectedRoute allowedRoles={['hod']}><Settings /></ProtectedRoute>} />
          <Route path="/hod/fees" element={<ProtectedRoute allowedRoles={['hod']}><FeeManagement /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
