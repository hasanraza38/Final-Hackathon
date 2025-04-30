import api from "../services/api.js"

let cachedUser = null;

const getUser = async () => {
  if (cachedUser) {
    return cachedUser;
  }

  try {
    const response = await api.get('/auth/authorizeuser');
    cachedUser = response.data;
    // console.log("Fetched User:", cachedUser);
    return cachedUser;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    return null;
  }
};

const isAuthenticated = async() => {
  try {
    const user = await getUser();

    if (!user) {
      // Try refreshing token
      await refreshToken();
      const refreshedUser = await getUser();
      return !!refreshedUser;
    }
    // console.log('Authentication status:', isAuth);
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error.response?.data || error.message);
    return false;
  }
}

const isAdmin = async () => {
  try {
    const user = await getUser();
    // console.log(user);
    const isAdminUser = user.user?.role === 'admin';
    // console.log('Admin status:', isAdminUser);
    return isAdminUser;
  } catch (error) {
    console.error('Error checking admin status:', error.response?.data || error.message);
    return false;
  }
}


const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    // console.log('Token refreshed:', response.data);
    cachedUser = null;
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw error;
  }
};



export { isAuthenticated, isAdmin , refreshToken}