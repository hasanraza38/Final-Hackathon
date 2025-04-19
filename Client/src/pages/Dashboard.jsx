import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    loanAmount: '',
    initialDeposit: '',
    loanPeriod: '',
    guarantors: [{ name: '', email: '', location: '', cnic: '' }, { name: '', email: '', location: '', cnic: '' }],
    address: { city: '', country: '' }
  });
  const [slip, setSlip] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await api.get('/categories');
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/loans', formData);
      setSlip(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting loan');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Loan Application</h1>
      {!slip ? (
        <form onSubmit={handleSubmit}>
          <select
            className="border p-2 mb-2"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
          >
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
          </select>
          {formData.category && (
            <select
              className="border p-2 mb-2"
              value={formData.subcategory}
              onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
            >
              <option value="">Select Subcategory</option>
              {categories.find(cat => cat.name === formData.category)?.subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}
          <input
            className="border p-2 mb-2"
            type="number"
            placeholder="Loan Amount"
            value={formData.loanAmount}
            onChange={e => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
          />
          <input
            className="border p-2 mb-2"
            type="number"
            placeholder="Initial Deposit"
            value={formData.initialDeposit}
            onChange={e => setFormData({ ...formData, initialDeposit: Number(e.target.value) })}
          />
          <input
            className="border p-2 mb-2"
            type="number"
            placeholder="Loan Period (years)"
            value={formData.loanPeriod}
            onChange={e => setFormData({ ...formData, loanPeriod: Number(e.target.value) })}
          />
          {formData.guarantors.map((g, i) => (
            <div key={i} className="border p-2 mb-2">
              <input
                className="border p-2 mb-2"
                placeholder="Guarantor Name"
                value={g.name}
                onChange={e => {
                  const guarantors = [...formData.guarantors];
                  guarantors[i].name = e.target.value;
                  setFormData({ ...formData, guarantors });
                }}
              />
              <input
                className="border p-2 mb-2"
                placeholder="Guarantor Email"
                value={g.email}
                onChange={e => {
                  const guarantors = [...formData.guarantors];
                  guarantors[i].email = e.target.value;
                  setFormData({ ...formData, guarantors });
                }}
              />
              <input
                className="border p-2 mb-2"
                placeholder="Guarantor Location"
                value={g.location}
                onChange={e => {
                  const guarantors = [...formData.guarantors];
                  guarantors[i].location = e.target.value;
                  setFormData({ ...formData, guarantors });
                }}
              />
              <input
                className="border p-2 mb-2"
                placeholder="Guarantor CNIC"
                value={g.cnic}
                onChange={e => {
                  const guarantors = [...formData.guarantors];
                  guarantors[i].cnic = e.target.value;
                  setFormData({ ...formData, guarantors });
                }}
              />
            </div>
          ))}
          <input
            className="border p-2 mb-2"
            placeholder="City"
            value={formData.address.city}
            onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
          />
          <input
            className="border p-2 mb-2"
            placeholder="Country"
            value={formData.address.country}
            onChange={e => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
          />
          <button className="bg-blue-500 text-white p-2">Submit</button>
        </form>
      ) : (
        <div className="border p-4">
          <h2 className="text-xl">Loan Slip</h2>
          <p>Token Number: {slip.tokenNumber}</p>
          <p>Appointment: {new Date(slip.appointment.date).toLocaleDateString()} at {slip.appointment.time}, {slip.appointment.officeLocation}</p>
          <img src={slip.qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default Dashboard;