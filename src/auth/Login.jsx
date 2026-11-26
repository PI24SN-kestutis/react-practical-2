import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from './AuthContext.js'
import './auth.css'

function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set by Register after a successful registration
  const justRegistered = location.state?.registered === true

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const validationErrors = {}
    if (!values.email.trim()) validationErrors.email = 'Įveskite el. paštą.'
    if (!values.password) validationErrors.password = 'Įveskite slaptažodį.'
    setErrors(validationErrors)
    setServerError('')
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await login(values.email, values.password)
      navigate('/dashboard')
    } catch (error) {
      setServerError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Prisijungimas</h1>
      {justRegistered && (
        <p className="form-success">Registracija sėkminga. Dabar galite prisijungti.</p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">El. paštas</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="password">Slaptažodis</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
        </button>
      </form>
      <p>
        Neturite paskyros? <Link to="/register">Registruotis</Link>
      </p>
    </section>
  )
}

export default Login
