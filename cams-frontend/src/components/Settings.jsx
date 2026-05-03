import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const Settings = () => {
  const navigate = useNavigate();
  const [threshold, setThreshold] = useState(75);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/hod')} className="hover:bg-purple-700 p-2 rounded">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Threshold</h2>
            <p className="text-gray-600 mb-4">Set the minimum attendance percentage required for students.</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="90"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-purple-600 w-16 text-center">{threshold}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Channels</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Email Alerts</p>
                  <p className="text-sm text-gray-600">Send low attendance alerts via email</p>
                </div>
                <button
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className={`w-12 h-6 rounded-full transition ${
                    emailEnabled ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition transform ${
                    emailEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">SMS Alerts</p>
                  <p className="text-sm text-gray-600">Send low attendance alerts via SMS</p>
                </div>
                <button
                  onClick={() => setSmsEnabled(!smsEnabled)}
                  className={`w-12 h-6 rounded-full transition ${
                    smsEnabled ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition transform ${
                    smsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <FiSave /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
