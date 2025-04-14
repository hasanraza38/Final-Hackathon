import React, { useState } from 'react';
import api from '../services/api';

function RegisterForm({ onClose }) {
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/auth/register', { cnic, email, name });
    alert('Check your email for a temporary password.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl mb-2">Register</h2>
        <form onSubmit={handleSubmit}>
          <input className="border p-2 mb-2 w-full" placeholder="CNIC" value={cnic} onChange={e => setCnic(e.target.value)} />
          <input className="border p-2 mb-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 mb-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <button className="bg-blue-500 text-white p-2 w-full">Submit</button>
        </form>
        <button className="mt-2 text-red-500" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default RegisterForm;