import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('Logging in...')
    try {
      await login(form)
      setStatus('Login successful')
      navigate('/posts')
    } catch (error) {
      setStatus(error.message || 'Login failed')
    }
  }

  return (
    <section className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Username (email)"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      {status ? <p className="statusText">{status}</p> : null}
    </section>
  )
}
