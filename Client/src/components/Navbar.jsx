import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import saylaniLogo from "../assets/saylani_logo.png";
import api from "../services/api.js";
import { isAuthenticated, isAdmin, clearUserCache } from "../utils/auth.js";
import LoginModal from "../components/LoginModal.jsx";
import SignupModal from "../components/SignupModal.jsx";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [fromSignup, setFromSignup] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (justLoggedOut) {
      setJustLoggedOut(false);
      return;
    }

    const checkAuthStatus = async () => {
      try {
        const authStatus = await isAuthenticated();
        setIsLoggedIn(authStatus);

        if (authStatus) {
          const adminStatus = await isAdmin();
          setAdmin(adminStatus);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.error("Error checking auth/admin:", error);
        setIsLoggedIn(false);
        setAdmin(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname, justLoggedOut]); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearUserCache();
      setIsLoggedIn(false);
      setAdmin(false);
      setIsDropdownOpen(false);
      setJustLoggedOut(true); 
      
      navigate("/loan-page", { replace: true });
    }
  };

  const handleLogin = async () => {
    clearUserCache();
    setIsLoggedIn(true);
    setShowLoginModal(false);
    
    try {
      const adminStatus = await isAdmin();
      setAdmin(adminStatus);
      
      if (adminStatus) {
        navigate("/admin-panel", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setShowSignupModal(false);
  };

  const handleSwitchToLogin = (success) => {
    setShowSignupModal(false);
    setFromSignup(success);
    setShowLoginModal(true);
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const navigateToLoanPage = () => navigate("/loan-page");

  if (isHomePage) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <img className="h-12 w-auto" src={saylaniLogo} alt="Saylani Logo" />
            </div>
            <div>
              <button
                onClick={navigateToLoanPage}
                className="bg-[#8dc63f] hover:bg-[#8ec63fee] text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Apply for Loan
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-12 w-auto" src={saylaniLogo} alt="Saylani Logo" />
              </Link>
            </div>

            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <span className="mr-2">My Account</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {admin ? (
                        <Link
                          to="/admin-panel"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setFromSignup(false);
                      setShowLoginModal(true);
                    }}
                    className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="bg-[#8dc63f] hover:bg-[#8ec63fe7] text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSwitchToSignup={handleSwitchToSignup}
          fromSignup={fromSignup}
        />
      )}

      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={handleSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  );
};

export default Navbar;
