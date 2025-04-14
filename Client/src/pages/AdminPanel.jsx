import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ city: '', country: '' });

  useEffect(() => {
    const fetchApplications = async () => {
      const { data } = await api.get('/admin/applications', { params: filters });
      setApplications(data);
    };
    fetchApplications();
  }, [filters]);

  const updateApplication = async (id, status, tokenNumber) => {
    await api.put(`/admin/applications/${id}`, { status, tokenNumber });
    setApplications(applications.map(app => app._id === id ? { ...app, status, tokenNumber } : app));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Panel</h1>
      <div className="mb-4">
        <input className="border p-2 mr-2" placeholder="Filter by City" value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
        <input className="border p-2" placeholder="Filter by Country" value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })} />
      </div>
      <div>
        {applications.map(app => (
          <div key={app._id} className="border p-2 mb-2">
            <p>User: {app.userId.name} ({app.userId.email})</p>
            <p>Loan: {app.category} - {app.subcategory}, PKR {app.loanAmount}</p>
            <p>Status: {app.status}</p>
            <p>Token Number: {app.tokenNumber || 'Not assigned'}</p>
            <input className="border p-1" placeholder="New Token" onChange={e => updateApplication(app._id, app.status, e.target.value)} />
            <select className="border p-1" onChange={e => updateApplication(app._id, e.target.value, app.tokenNumber)}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;