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
    return <div>Loading...</div>;
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
    return <div>Loading...</div>; 
  }

  if (!authState.isAuth || !authState.isAdmin) {
    return <Navigate to="/loan-page" replace />;
  }

  return children;
};
