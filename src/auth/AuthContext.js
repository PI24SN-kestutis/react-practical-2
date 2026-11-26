import { createContext } from 'react'

// Provides: user, isAuthenticated, login(email, password), logout()
const AuthContext = createContext(null)

export default AuthContext
