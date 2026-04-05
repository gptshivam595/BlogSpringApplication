import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
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
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Register</Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <TextField
            label="About"
            multiline
            minRows={3}
            value={form.about}
            onChange={(event) => setForm({ ...form, about: event.target.value })}
            required
          />
          <Button type="submit" variant="contained">Register</Button>
        </Stack>
        {status ? <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert> : null}
      </CardContent>
    </Card>
  )
}
