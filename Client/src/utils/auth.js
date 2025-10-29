import api from "../services/api.js"

let cachedUser = null;


const getUser = async () => {
  if (cachedUser) return cachedUser;

  try {
    const res = await api.get("/auth/authenticateuser");
    if (res.data?.isAuthenticated && res.data?.user) {
      cachedUser = res.data.user;
      return cachedUser;
    }
    cachedUser = null;
    return null;
  } catch (error) {
    if (error.response?.status === 401) {
      cachedUser = null;
    }
    console.error("Error fetching user:", error.response?.data || error.message);
    return null;
  }
};


const refreshToken = async () => {
  try {
    const res = await api.post("/auth/refresh");
    cachedUser = null; 
    return res.data;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    return null;
  }
};


const isAuthenticated = async () => {
  try {
    let user = await getUser();

    if (!user) {
      const refreshed = await refreshToken();
      if (refreshed) {
        user = await getUser();
      }
    }

    return !!user;
  } catch (error) {
    console.error("Error checking authentication:", error.response?.data || error.message);
    cachedUser = null; 
    return false;
  }
};

const isAdmin = async () => {
  try {
    const user = await getUser();     
    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error.response?.data || error.message);
    return false;
  }
};

const clearUserCache = () => {
  cachedUser = null;
};

export { isAuthenticated, isAdmin, refreshToken, clearUserCache };