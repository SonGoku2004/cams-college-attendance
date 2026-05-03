import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HodDashboard from './pages/HodDashboard';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === 'student' && <StudentDashboard />}
          {user?.role === 'teacher' && <TeacherDashboard />}
          {user?.role === 'hod' && <HodDashboard />}
          {!user && <Navigate to="/login" />}
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;