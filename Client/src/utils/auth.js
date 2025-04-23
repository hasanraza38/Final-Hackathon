const isAuthenticated = () => {
    // Get all cookies
    const cookies = document.cookie.split(";").reduce((cookiesObj, cookie) => {
      const [name, value] = cookie.trim().split("=").map(decodeURIComponent)
      cookiesObj[name] = value
      return cookiesObj
    }, {})
    
    
  console.log(cookies["accessToken"]);
  
    return !!cookies["accessToken"]
  }
  
  // Function to get user data from cookies if available
  // This is a placeholder - you might not store user data in cookies
  const getUserFromCookies = () => {
    try {
      // If you store encoded user data in a cookie, you can retrieve it here
      // For example, if you have a 'user_data' cookie with JSON data:
      const cookies = document.cookie.split(";").reduce((cookiesObj, cookie) => {
        const [name, value] = cookie.trim().split("=").map(decodeURIComponent)
        cookiesObj[name] = value
        return cookiesObj
      }, {})
  
      // If you don't store user data in cookies, return a default user object
      // or null, depending on your application's needs
      return {
        id: 1,
        name: "User",
        email: "user@example.com",
      }
    } catch (error) {
      console.error("Error parsing user data from cookies:", error)
      return null
    }
  }
  
  export { isAuthenticated, getUserFromCookies }