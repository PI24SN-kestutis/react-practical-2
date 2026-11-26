import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AuthContext from '../auth/AuthContext.js'

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">Receptai</NavLink>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Receptai</NavLink>
            <NavLink to="/favorites">Mėgstamiausi</NavLink>
            <span className="navbar-user">{user.name}</span>
            <button type="button" className="navbar-button" onClick={handleLogout}>
              Atsijungti
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Prisijungti</NavLink>
            <NavLink to="/register">Registruotis</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
