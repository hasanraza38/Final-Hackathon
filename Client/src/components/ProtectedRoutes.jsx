import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/auth.js";


export const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuth: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await isAuthenticated();
        console.log("ProtectedRoute auth result:", result);

        setAuthState({ isAuth: result, loading: false });
      } catch (error) {
        console.error("ProtectedRoute error:", error);
        setAuthState({ isAuth: false, loading: false });
      }
    };

    checkAuth();
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-[#8dc63f] mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuth) {
    return <Navigate to="/loan-page" replace />;
  }

  return children;
};



export const AdminProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuth: false,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const auth = await isAuthenticated();
        if (!auth) {
          return setAuthState({ isAuth: false, isAdmin: false, loading: false });
        }

        const admin = await isAdmin();

        setAuthState({ isAuth: true, isAdmin: admin, loading: false });
      } catch (error) {
        console.error("AdminProtectedRoute error:", error);
        setAuthState({ isAuth: false, isAdmin: false, loading: false });
      }
    };

    checkAuthAndRole();
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-[#8dc63f] mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600 text-sm">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuth || !authState.isAdmin) {
    return <Navigate to="/loan-page" replace />;
  }

  return children;
};
