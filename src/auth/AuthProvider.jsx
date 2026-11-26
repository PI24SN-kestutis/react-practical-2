import { useState } from 'react'
import AuthContext from './AuthContext.js'
import { loginUser } from '../api/authApi.js'

const STORAGE_KEY = 'recipeAppUser'

// Restores the user after a page reload (runs once, synchronously)
function readStoredUser() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const isAuthenticated = user !== null

  async function login(email, password) {
    // Throws an Error when the data is wrong - the Login form shows it
    const loggedInUser = await loginUser(email, password)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
    setUser(loggedInUser)
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
