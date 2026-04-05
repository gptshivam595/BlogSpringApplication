import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', about: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('Registering...')
    try {
      await register(form)
      setStatus('Registration successful. Please login.')
      navigate('/login')
    } catch (error) {
      setStatus(error.message || 'Registration failed')
    }
  }

  return (
    <section className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <textarea
          placeholder="About"
          value={form.about}
          onChange={(event) => setForm({ ...form, about: event.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
      {status ? <p className="statusText">{status}</p> : null}
    </section>
  )
}
