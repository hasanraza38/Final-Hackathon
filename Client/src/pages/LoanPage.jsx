import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import LoanCard from "../components/LoanCard"
import LoginModal from "../components/LoginModal"
import SignupModal from "../components/SignupModal"
import Footer from "../components/Footer"
import api from "../services/api"
import { isAuthenticated} from "../utils/auth"

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
    // Check if user is logged in by checking for auth cookies
    const authStatus = isAuthenticated()
    setIsLoggedIn(authStatus)


    // Fetch loans from API
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    setIsLoading(true)
    setError(null) // Reset error state before new fetch attempt

    try {
      // Fetch loan categories from the API
      // Make sure the API endpoint is correct and accessible
      const response = await api.get("/admin/getcategories")

      // Check if response has data property and it's an array
      if (response.data && Array.isArray(response.data)) {
        setLoans(response.data)
      } else if (response.data && Array.isArray(response.data.data)) {
        // Some APIs nest data in a data property
        setLoans(response.data.data)
      } else {
        // If data structure is unexpected
        console.error("Unexpected API response format:", response.data)
        setError("Received unexpected data format from server")
        // Fall back to mock data
        setLoans(getMockLoans())
      }
    } catch (err) {
      console.error("Error fetching loans:", err)

      // More detailed error message based on the error type
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const statusCode = err.response.status
        if (statusCode === 401 || statusCode === 403) {
          setError("You don't have permission to access loan categories")
        } else if (statusCode === 404) {
          setError("Loan categories endpoint not found")
        } else {
          setError(`Server error (${statusCode}): ${err.response.data?.message || "Unknown error"}`)
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.")
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message || "Unknown error occurred"}`)
      }

      // Fall back to mock data
      setLoans(getMockLoans())
    } finally {
      setIsLoading(false)
    }
  }

  // Separate function for mock data to keep code clean
  const getMockLoans = () => {
    return [
      {
        id: 1,
        name: "loan wedding",
        maxLoan: 500000,
        loanPeriod: 3,
        subcategories: ["Valima", "Furniture", "Food"],
      },
      {
        id: 2,
        name: "education loan",
        maxLoan: 300000,
        loanPeriod: 6,
        subcategories: ["Tuition", "Books", "Accommodation"],
      },
      {
        id: 3,
        name: "business loan",
        maxLoan: 750000,
        loanPeriod: 12,
        subcategories: ["Startup", "Expansion", "Equipment"],
      },
      {
        id: 4,
        name: "emergency loan",
        maxLoan: 100000,
        loanPeriod: 3,
        subcategories: ["Medical", "Repair", "Travel"],
      },
    ]
  }

  const handleLogin = (userData) => {
    setUserData(userData)
    setIsLoggedIn(true)
    setShowLoginModal(false)
    // Refresh the page to ensure all components recognize the auth state
    window.location.reload()
  }

  const handleSignup = (userData) => {
    setUserData(userData)
    setIsLoggedIn(true)
    setShowSignupModal(false)
  }

  const handleLogout = async () => {
    try {
      // Call your logout endpoint to clear cookies
      await api.post("auth/logout")

      // Update state
      setIsLoggedIn(false)
      setUserData(null)

      // Refresh the page to ensure all components recognize the auth state
      window.location.reload()
    } catch (error) {
      console.error("Error during logout:", error)
    }
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
      // Navigate to application page
      window.location.href = "/application"
    } else {
      // Show signup modal
      setShowSignupModal(true)
    }
  }

  // Function to retry fetching loans
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
        onLogout={handleLogout}
        userData={userData}
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

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={handleSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  )
}

export default LoanPage
