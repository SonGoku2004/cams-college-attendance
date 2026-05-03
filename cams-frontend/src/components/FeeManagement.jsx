import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const FeeManagement = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState([
    { id: 1, student: 'Jane Student', roll: 'S001', amount: 50000, paid: 50000, status: 'paid', dueDate: '2026-03-15' },
    { id: 2, student: 'John Doe', roll: 'S002', amount: 50000, paid: 30000, status: 'partial', dueDate: '2026-03-15' },
    { id: 3, student: 'Alice Smith', roll: 'S003', amount: 50000, paid: 50000, status: 'paid', dueDate: '2026-03-15' },
    { id: 4, student: 'Bob Johnson', roll: 'S004', amount: 50000, paid: 0, status: 'pending', dueDate: '2026-03-15' },
    { id: 5, student: 'Emma Davis', roll: 'S005', amount: 50000, paid: 20000, status: 'partial', dueDate: '2026-03-15' },
  ]);

  const totalPending = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + (f.amount - f.paid), 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);

  const markAsPaid = (id) => {
    setFees(fees.map(f => 
      f.id === id ? { ...f, status: 'paid', paid: f.amount } : f
    ));
    alert('Payment updated!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/hod')} className="hover:bg-purple-700 p-2 rounded">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Fee Management</h1>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm">Total Collected</p>
                <p className="text-3xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500">This semester</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm">Pending Dues</p>
                <p className="text-3xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <FiAlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500">{fees.filter(f => f.status !== 'paid').length} students</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm">Collection Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round((totalCollected / (totalCollected + totalPending)) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FiCheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500">Target: 95%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Total Fee</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Paid</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Balance</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{fee.roll}</td>
                  <td className="px-6 py-4 text-gray-600">{fee.student}</td>
                  <td className="px-6 py-4 text-center text-gray-800">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-green-600">₹{fee.paid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-red-600">
                    ₹{(fee.amount - fee.paid).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                      fee.status === 'pending' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fee.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {fee.status !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(fee.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Mark Paid
                      </button>
                    )}
                    {fee.status === 'paid' && (
                      <span className="text-green-600 flex items-center justify-center gap-1">
                        <FiCheckCircle size={14} /> Paid
                      </span>
                    )}
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

export default FeeManagement;
