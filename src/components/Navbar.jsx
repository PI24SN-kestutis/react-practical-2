import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">Receptai</NavLink>
      <div className="navbar-links">
        <NavLink to="/dashboard">Receptai</NavLink>
        <NavLink to="/favorites">Mėgstamiausi</NavLink>
        <NavLink to="/login">Prisijungti</NavLink>
        <NavLink to="/register">Registruotis</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
