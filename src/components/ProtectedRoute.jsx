import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  console.log("Hola desde protected")
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  return isLoggedIn ? children : <Navigate to="/" replace />
}

export default ProtectedRoute