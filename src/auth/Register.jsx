import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi.js'
import './auth.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Įveskite vardą.'
  if (!values.email.trim()) {
    errors.email = 'Įveskite el. paštą.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Neteisingas el. pašto formatas.'
  }
  if (!values.password) {
    errors.password = 'Įveskite slaptažodį.'
  } else if (values.password.length < 6) {
    errors.password = 'Slaptažodį turi sudaryti bent 6 simboliai.'
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Pakartokite slaptažodį.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Slaptažodžiai nesutampa.'
  }
  return errors
}

function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const validationErrors = validate(values)
    setErrors(validationErrors)
    setServerError('')
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await registerUser(values)
      navigate('/login', { state: { registered: true } })
    } catch (error) {
      setServerError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Registracija</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Vardas</label>
          <input id="name" name="name" type="text" value={values.name} onChange={handleChange} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

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

        <div className="form-field">
          <label htmlFor="confirmPassword">Pakartokite slaptažodį</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Registruojama...' : 'Registruotis'}
        </button>
      </form>
      <p>
        Jau turite paskyrą? <Link to="/login">Prisijungti</Link>
      </p>
    </section>
  )
}

export default Register
