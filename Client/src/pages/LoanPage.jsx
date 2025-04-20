// import React, { useState, useEffect } from 'react';
// import api from '../services/api';

// function LandingPage({ setShowRegister }) {
//   const [categories, setCategories] = useState([]);
//   const [category, setCategory] = useState('');
//   const [subcategory, setSubcategory] = useState('');
//   const [initialDeposit, setInitialDeposit] = useState(0);
//   const [loanPeriod, setLoanPeriod] = useState(1);
//   const [breakdown, setBreakdown] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const { data } = await api.get('/categories');
//       setCategories(data);
//     };
//     fetchCategories();
//   }, []);

//   const calculate = () => {
//     const selectedCategory = categories.find(cat => cat.name === category);
//     if (!selectedCategory) return;
//     const maxLoan = selectedCategory.maxLoan;
//     const loanAmount = maxLoan - initialDeposit;
//     const monthlyPayment = loanAmount / (loanPeriod * 12);
//     setBreakdown({ loanAmount, monthlyPayment });
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-4">Saylani Microfinance</h1>
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         {categories.map(cat => (
//           <div key={cat._id} className="border p-4">
//             <h2 className="text-xl">{cat.name}</h2>
//             <ul>{cat.subcategories.map(sub => <li key={sub}>{sub}</li>)}</ul>
//           </div>
//         ))}
//       </div>
//       <div className="border p-4">
//         <h2 className="text-xl mb-2">Loan Calculator</h2>
//         <select className="border p-2 mb-2" onChange={e => setCategory(e.target.value)}>
//           <option value="">Select Category</option>
//           {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
//         </select>
//         {category && (
//           <select className="border p-2 mb-2" onChange={e => setSubcategory(e.target.value)}>
//             <option value="">Select Subcategory</option>
//             {categories.find(cat => cat.name === category)?.subcategories.map(sub => (
//               <option key={sub} value={sub}>{sub}</option>
//             ))}
//           </select>
//         )}
//         <input
//           type="number"
//           className="border p-2 mb-2"
//           placeholder="Initial Deposit"
//           onChange={e => setInitialDeposit(Number(e.target.value))}
//         />
//         <input
//           type="number"
//           className="border p-2 mb-2"
//           placeholder="Loan Period (years)"
//           onChange={e => setLoanPeriod(Number(e.target.value))}
//         />
//         <button className="bg-blue-500 text-white p-2" onClick={calculate}>Calculate</button>
//         {breakdown && (
//           <div>
//             <p>Loan Amount: PKR {breakdown.loanAmount}</p>
//             <p>Monthly Payment: PKR {breakdown.monthlyPayment.toFixed(2)}</p>
//             <button className="bg-green-500 text-white p-2 mt-2" onClick={() => setShowRegister(true)}>Proceed</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LandingPage;

"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import LoanCard from "../components/LoanCard"
import LoginModal from "../components/LoginModal"
import SignupModal from "../components/SignupModal"
import Footer from "../components/Footer"

const LoanPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in from localStorage or session
    const userToken = localStorage.getItem("userToken")
    if (userToken) {
      setIsLoggedIn(true)
    }

    // Fetch loans from API
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('https://api.example.com/loans')
      // const data = await response.json()

      // Mock data for demonstration
      const mockLoans = [
        {
          id: 1,
          title: "Business Startup Loan",
          amount: "50,000",
          duration: "12 months",
          interestRate: "5%",
          description: "Perfect for entrepreneurs looking to start a new business venture.",
        },
        {
          id: 2,
          title: "Education Loan",
          amount: "100,000",
          duration: "24 months",
          interestRate: "3%",
          description: "Support your educational goals with our low-interest education loans.",
        },
        {
          id: 3,
          title: "Home Improvement Loan",
          amount: "150,000",
          duration: "36 months",
          interestRate: "4%",
          description: "Renovate and improve your living space with flexible repayment options.",
        },
        {
          id: 4,
          title: "Emergency Loan",
          amount: "25,000",
          duration: "6 months",
          interestRate: "6%",
          description: "Quick access to funds for unexpected emergencies and urgent needs.",
        },
      ]

      setLoans(mockLoans)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to fetch loans. Please try again later.")
      setIsLoading(false)
      console.error("Error fetching loans:", err)
    }
  }

  const handleLogin = (userData) => {
    // In a real app, you would validate credentials with your backend
    console.log("Login data:", userData)
    localStorage.setItem("userToken", "sample-token")
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  const handleSignup = (userData) => {
    // In a real app, you would send registration data to your backend
    console.log("Signup data:", userData)
    localStorage.setItem("userToken", "sample-token")
    setIsLoggedIn(true)
    setShowSignupModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    setIsLoggedIn(false)
  }

  const handleApplyClick = () => {
    if (isLoggedIn) {
      // Navigate to application page
      window.location.href = "/application"
    } else {
      // Show signup modal
      setShowSignupModal(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Loan Programs</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our range of microfinance solutions designed to help you achieve your goals. Whether you're starting
            a business, pursuing education, or improving your home, we have options for you.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={handleApplyClick}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-300"
          >
            Apply for a Loan
          </button>
        </div>
      </main>

      <Footer />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSwitchToSignup={() => {
            setShowLoginModal(false)
            setShowSignupModal(true)
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={handleSignup}
          onSwitchToLogin={() => {
            setShowSignupModal(false)
            setShowLoginModal(true)
          }}
        />
      )}
    </div>
  )
}

export default LoanPage
