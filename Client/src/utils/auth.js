import api from "../services/api.js"

const isAuthenticated = () => {
  const cookies = document.cookie.split(";").reduce((cookiesObj, cookie) => {
    const [name, value] = cookie.trim().split("=").map(decodeURIComponent)
    cookiesObj[name] = value
    return cookiesObj
  }, {})

  return !!cookies["accessToken"]
}

const isAdmin = () => {
  const cookies = document.cookie.split(";").reduce((cookiesObj, cookie) => {
    const [name, value] = cookie.trim().split("=").map(decodeURIComponent)
    cookiesObj[name] = value
    return cookiesObj
  }, {})
  
  return cookies["role"] === "admin"
}



const refreshAccessToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data; 
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw error; 
  }
};

export { isAuthenticated, isAdmin, refreshAccessToken }