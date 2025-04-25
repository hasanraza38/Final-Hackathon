import { useState, useEffect } from "react"
import Navbar from "../components/Navbar.jsx"
import LoanCard from "../components/LoanCard.jsx"
import LoginModal from "../components/LoginModal.jsx"
import SignupModal from "../components/SignupModal.jsx"
import Footer from "../components/Footer.jsx"
import api from "../services/api.js"
import { isAuthenticated} from "../utils/auth.js"

const LoanPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [fromSignup, setFromSignup] = useState(false)
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const authStatus = isAuthenticated()
    setIsLoggedIn(authStatus)
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    setIsLoading(true)
    setError(null) 

    try {
      const response = await api.get("/admin/getcategories")
      setLoans(response.data)

    } catch (err) {
      console.error("Error fetching loans:", err)
      if (err.response) {
        const statusCode = err.response.status
        if (statusCode === 401 || statusCode === 403) {
          setError("You don't have permission to access loan categories")
        } else if (statusCode === 404) {
          setError("Loan categories endpoint not found")
        } else {
          setError(`Server error (${statusCode}): ${err.response.data?.message || "Unknown error"}`)
        }
      } else if (err.request) {
        setError("No response from server. Please check your internet connection.")
      } else {
        setError(`Error: ${err.message || "Unknown error occurred"}`)
      }

    } finally {
      setIsLoading(false)
    }
  }

  
  
    const handleLogin = (userData) => {
    setUserData(userData)
    setIsLoggedIn(true)
    setShowLoginModal(false)

    window.location.reload()
  }

  const handleSignup = (userData) => {
    setUserData(userData)
    setIsLoggedIn(true)
    setShowSignupModal(false)
  }

  

  const handleSwitchToLogin = (success) => {
    setShowSignupModal(false)
    setFromSignup(success)
    setShowLoginModal(true)
  }

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const handleApplyClick = () => {
    if (isLoggedIn) {
      window.location.href = "/application"
    } else {
      setShowSignupModal(true)
    }
  }

const handleRetry = () => {
    fetchLoans()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => {
          setFromSignup(false)
          setShowLoginModal(true)
        }}
        onSignupClick={() => setShowSignupModal(true)}
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8dc63f]"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-md">
            <p className="text-gray-600 mb-4">No loan programs are currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <LoanCard key={loan.id || loan._id} loan={loan} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={handleApplyClick}
            className="bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-300"
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
          onSwitchToSignup={handleSwitchToSignup}
          fromSignup={fromSignup}
        />
      )}
      {/* Login Modal */}


      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
        onClose={() => setShowSignupModal(false)}
        onSignup={handleSignup}
        onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      {/* Signup Modal */}
    </div>
  )
}

export default LoanPage
