import { useState, useEffect } from "react"
import Navbar from "../components/Navbar.jsx"
import LoanCard from "../components/LoanCard.jsx"
import LoginModal from "../components/LoginModal.jsx"
import SignupModal from "../components/SignupModal.jsx"
import Footer from "../components/Footer.jsx"

const LoanPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
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
      // Fetch user data if token exists
      fetchUserData(userToken)
    }

    // Fetch loans from API
    fetchLoans()
  }, [])

  const fetchUserData = async (token) => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('https://api.example.com/user/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // })
      // const data = await response.json()

      // Mock user data for demonstration
      const mockUserData = {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+92 300 1234567",
      }

      setUserData(mockUserData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      // If token is invalid, log the user out
      if (error.response && error.response.status === 401) {
        handleLogout()
      }
    }
  }

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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setLoans(mockLoans)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to fetch loans. Please try again later.")
      setIsLoading(false)
      console.error("Error fetching loans:", err)
    }
  }

  const handleLogin = (authData) => {
    console.log("Login successful:", authData)
    localStorage.setItem("userToken", authData.token)
    setUserData(authData.user)
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  const handleSignup = (authData) => {
    console.log("Signup successful:", authData)
    localStorage.setItem("userToken", authData.token)
    setUserData(authData.user)
    setIsLoggedIn(true)
    setShowSignupModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    setIsLoggedIn(false)
    setUserData(null)
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
        userData={userData}
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
