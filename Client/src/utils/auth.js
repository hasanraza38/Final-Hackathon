
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


export { isAuthenticated, isAdmin }