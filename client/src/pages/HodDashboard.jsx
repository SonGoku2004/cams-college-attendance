import { useState, useEffect } from 'react';
import { useAuth, apiFetch } from '../context/AuthContext';

export default function HodDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'student' });
  const [newSubject, setNewSubject] = useState({ code: '', name: '', credits: 3 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [sRes, tRes, subRes, nRes] = await Promise.all([
      apiFetch('/api/users/students'),
      apiFetch('/api/users/teachers'),
      apiFetch('/api/subjects'),
      apiFetch('/api/notices')
    ]);
    if (sRes.ok) setStudents(await sRes.json());
    if (tRes.ok) setTeachers(await tRes.json());
    if (subRes.ok) setSubjects(await subRes.json());
    if (nRes.ok) setNotices(await nRes.json());
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await apiFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      setShowUserModal(false);
      loadData();
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    const res = await apiFetch('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(newSubject)
    });
    if (res.ok) {
      setShowSubjectModal(false);
      loadData();
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete user?')) return;
    await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Delete subject?')) return;
    await apiFetch(`/api/subjects/${id}`, { method: 'DELETE' });
    loadData();
  };

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'notices', label: 'Notices' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>HOD Portal</h1>
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
        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h3>Students ({students.length})</h3>
              <button onClick={() => { setNewUser({ email: '', password: '', name: '', role: 'student' }); setShowUserModal(true); }}>
                + Add Student
              </button>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.created_at?.split('T')[0]}</td>
                    <td><button className="delete" onClick={() => handleDeleteUser(s.id)}>Delete</button></td></tr>
                ))}
              </tbody>
            </table>

            <div className="section-header">
              <h3>Teachers ({teachers.length})</h3>
              <button onClick={() => { setNewUser({ email: '', password: '', name: '', role: 'teacher' }); setShowUserModal(true); }}>
                + Add Teacher
              </button>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id}><td>{t.name}</td><td>{t.email}</td><td>{t.created_at?.split('T')[0]}</td>
                    <td><button className="delete" onClick={() => handleDeleteUser(t.id)}>Delete</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="subjects-section">
            <div className="section-header">
              <h3>Subjects ({subjects.length})</h3>
              <button onClick={() => { setNewSubject({ code: '', name: '', credits: 3 }); setShowSubjectModal(true); }}>
                + Add Subject
              </button>
            </div>
            <table className="data-table">
              <thead><tr><th>Code</th><th>Name</th><th>Credits</th><th>Actions</th></tr></thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id}><td>{s.code}</td><td>{s.name}</td><td>{s.credits}</td>
                    <td><button className="delete" onClick={() => handleDeleteSubject(s.id)}>Delete</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="notices-section">
            <h3>Send Notice</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.target);
              await apiFetch('/api/notices', {
                method: 'POST',
                body: JSON.stringify({
                  type: form.get('type'),
                  message: form.get('message'),
                  student_ids: students.map(s => s.id)
                })
              });
              loadData();
            }}>
              <select name="type"><option value="attendance">Attendance</option><option value="fee">Fee</option><option value="general">General</option></select>
              <textarea name="message" placeholder="Message" required />
              <button type="submit">Send to All Students</button>
            </form>
            <h3>Recent Notices</h3>
            {notices.slice(0, 10).map(n => (
              <div key={n.id} className="notice-card">
                <span className="notice-type">{n.type}</span>
                <p>{n.message}</p>
                <small>{new Date(n.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <button onClick={() => window.open('/api/reports/attendance-daily', '_blank')}>
              Daily Attendance (Excel)
            </button>
            <button onClick={() => window.open('/api/reports/attendance-summary', '_blank')}>
              Attendance Summary (Excel)
            </button>
          </div>
        )}
      </main>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add {newUser.role === 'student' ? 'Student' : 'Teacher'}</h3>
            <form onSubmit={handleCreateUser}>
              <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
              <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowUserModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showSubjectModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Subject</h3>
            <form onSubmit={handleCreateSubject}>
              <input type="text" placeholder="Code" value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} required />
              <input type="text" placeholder="Name" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} required />
              <input type="number" placeholder="Credits" value={newSubject.credits} onChange={e => setNewSubject({ ...newSubject, credits: e.target.value })} />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowSubjectModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}