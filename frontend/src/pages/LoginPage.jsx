import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
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
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            label="Username (email)"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Button type="submit" variant="contained">Login</Button>
        </Stack>
        {status ? <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert> : null}
      </CardContent>
    </Card>
  )
}
