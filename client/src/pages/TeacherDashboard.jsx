import { useState, useEffect } from 'react';
import { useAuth, apiFetch } from '../context/AuthContext';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('mark');

  useEffect(() => {
    loadSubjects();
    loadStudents();
  }, []);

  const loadSubjects = async () => {
    const res = await apiFetch('/api/subjects');
    if (res.ok) setSubjects(await res.json());
  };

  const loadStudents = async () => {
    const res = await apiFetch('/api/users/students');
    if (res.ok) setStudents(await res.json());
  };

  const loadAttendance = async () => {
    if (!selectedSubject) return;
    const res = await apiFetch(`/api/attendance?subject_id=${selectedSubject}&date=${date}`);
    if (res.ok) setAttendance(await res.json());
  };

  const handleMark = async (studentId, status) => {
    const res = await apiFetch('/api/attendance', {
      method: 'POST',
      body: JSON.stringify({
        records: [{ student_id: studentId, subject_id: selectedSubject, date, status }]
      })
    });
    if (res.ok) {
      setAttendance(prev => {
        const exists = prev.find(a => a.student_id === studentId);
        if (exists) {
          return prev.map(a => a.student_id === studentId ? { ...a, status } : a);
        }
        return [...prev, { student_id: studentId, student_name: '', subject_id: selectedSubject, status }];
      });
    }
  };

  const handleMarkAll = async (status) => {
    for (const student of students) {
      await handleMark(student.id, status);
    }
  };

  const tabs = [
    { id: 'mark', label: 'Mark Attendance' },
    { id: 'reports', label: 'View Reports' }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Teacher Portal</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'mark' && (
          <div className="mark-attendance">
            <div className="filters">
              <select value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setTimeout(loadAttendance, 100); }}>
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div className="quick-actions">
              <button onClick={() => handleMarkAll('present')}>Mark All Present</button>
              <button onClick={() => handleMarkAll('absent')}>Mark All Absent</button>
            </div>

            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Email</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const rec = attendance.find(a => a.student_id === s.id);
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td className={rec?.status}>{rec?.status || '-'}</td>
                      <td>
                        <button onClick={() => handleMark(s.id, 'present')}>P</button>
                        <button onClick={() => handleMark(s.id, 'absent')}>A</button>
                        <button onClick={() => handleMark(s.id, 'late')}>L</button>
                        <button onClick={() => handleMark(s.id, 'excused')}>E</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <button onClick={() => window.open('/api/reports/attendance-daily?date=' + date, '_blank')}>
              Export Daily Attendance (Excel)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}