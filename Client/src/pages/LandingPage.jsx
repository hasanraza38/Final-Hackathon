import React, { useState, useEffect } from 'react';
import api from '../services/api';

function LandingPage({ setShowRegister }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [loanPeriod, setLoanPeriod] = useState(1);
  const [breakdown, setBreakdown] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await api.get('/categories');
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const calculate = () => {
    const selectedCategory = categories.find(cat => cat.name === category);
    if (!selectedCategory) return;
    const maxLoan = selectedCategory.maxLoan;
    const loanAmount = maxLoan - initialDeposit;
    const monthlyPayment = loanAmount / (loanPeriod * 12);
    setBreakdown({ loanAmount, monthlyPayment });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Saylani Microfinance</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {categories.map(cat => (
          <div key={cat._id} className="border p-4">
            <h2 className="text-xl">{cat.name}</h2>
            <ul>{cat.subcategories.map(sub => <li key={sub}>{sub}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border p-4">
        <h2 className="text-xl mb-2">Loan Calculator</h2>
        <select className="border p-2 mb-2" onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
        </select>
        {category && (
          <select className="border p-2 mb-2" onChange={e => setSubcategory(e.target.value)}>
            <option value="">Select Subcategory</option>
            {categories.find(cat => cat.name === category)?.subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        )}
        <input
          type="number"
          className="border p-2 mb-2"
          placeholder="Initial Deposit"
          onChange={e => setInitialDeposit(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-2 mb-2"
          placeholder="Loan Period (years)"
          onChange={e => setLoanPeriod(Number(e.target.value))}
        />
        <button className="bg-blue-500 text-white p-2" onClick={calculate}>Calculate</button>
        {breakdown && (
          <div>
            <p>Loan Amount: PKR {breakdown.loanAmount}</p>
            <p>Monthly Payment: PKR {breakdown.monthlyPayment.toFixed(2)}</p>
            <button className="bg-green-500 text-white p-2 mt-2" onClick={() => setShowRegister(true)}>Proceed</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;