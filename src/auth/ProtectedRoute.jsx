import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from './AuthContext.js'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    // "replace" removes the protected URL from history, so Back does not loop
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
