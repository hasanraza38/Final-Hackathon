import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../utils/auth.js';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await isAuthenticated();
        setIsAuth(result);
        // console.log(result);
      } catch (error) {
        console.error('ProtectedRoute error:', error);
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  // console.log('Auth status:', isAuth);

  if (isAuth === null) {
    return <div>Loading...</div>; 
  }

  if (!isAuth) {
    return <Navigate to="/loan-page" replace />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);

  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      const result = await isAuthenticated();
      if (!result) {
        setAuth(false);
        setAdmin(false);
        return;
      }

      const isAdminUser = await isAdmin();
      setAuth(true);
      setAdmin(isAdminUser);
    };

    checkAuthAndAdmin();
  }, []);

  if (auth === undefined || admin === undefined) {
    return <div>loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/loan-page" replace />;
  }

  if (!admin) {
    return <Navigate to="/loan-page" replace />;
  }

  return children;
};

export { ProtectedRoute, AdminProtectedRoute };
