import { useState, useEffect } from 'react';
import { useAuth, apiFetch } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [attendance, setAttendance] = useState({ bySubject: [], total: {} });
  const [fees, setFees] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [attRes, feesRes, noticesRes] = await Promise.all([
      apiFetch('/api/attendance/my-stats'),
      apiFetch('/api/fees/my-fees'),
      apiFetch('/api/notices/my-notices')
    ]);
    if (attRes.ok) setAttendance(await attRes.json());
    if (feesRes.ok) setFees(await feesRes.json());
    if (noticesRes.ok) setNotices(await noticesRes.json());
  };

  const tabs = [
    { id: 'attendance', label: 'My Attendance' },
    { id: 'fees', label: 'Fees Status' },
    { id: 'notices', label: 'Notices' }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Portal</h1>
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
        {activeTab === 'attendance' && (
          <div className="attendance-section">
            <div className="stats-card">
              <h3>Overall Attendance</h3>
              <div className="stat-value">{attendance.total.percentage || 0}%</div>
              <div className="stat-detail">
                {attendance.total.present || 0} / {attendance.total.total || 0} classes
              </div>
              {(attendance.total.percentage || 0) < 75 && (
                <div className="warning">⚠️ Below 75% threshold</div>
              )}
            </div>

            <h3>By Subject</h3>
            <table className="data-table">
              <thead>
                <tr><th>Subject</th><th>Code</th><th>Present</th><th>Total</th><th>%</th></tr>
              </thead>
              <tbody>
                {attendance.bySubject.map(s => (
                  <tr key={s.subject_id}>
                    <td>{s.name}</td>
                    <td>{s.code}</td>
                    <td>{s.present}</td>
                    <td>{s.total}</td>
                    <td className={s.percentage < 75 ? 'low' : ''}>{s.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="fees-section">
            <table className="data-table">
              <thead>
                <tr><th>Amount</th><th>Due Date</th><th>Paid Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id}>
                    <td>${f.amount}</td>
                    <td>{f.due_date}</td>
                    <td>{f.paid_date || '-'}</td>
                    <td className={f.status}>{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="notices-section">
            {notices.length === 0 ? <p>No notices</p> : notices.map(n => (
              <div key={n.id} className={`notice-card ${n.is_read ? '' : 'unread'}`}>
                <span className="notice-type">{n.type}</span>
                <p>{n.message}</p>
                <small>{new Date(n.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}