import {
  Alert,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function AdminDashboardPage() {
  const { token } = useAuth()

  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryForm, setCategoryForm] = useState({ categoryTitle: '', categoryDescription: '' })
  const [status, setStatus] = useState('')

  const load = useCallback(async () => {
    try {
      const [loadedUsers, loadedCategories] = await Promise.all([api.getUsers(token), api.getCategories()])
      setUsers(loadedUsers)
      setCategories(loadedCategories)
    } catch (error) {
      setStatus(error.message || 'Load failed')
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const createCategory = async (event) => {
    event.preventDefault()
    try {
      await api.createCategory(categoryForm, token)
      setCategoryForm({ categoryTitle: '', categoryDescription: '' })
      setStatus('Category created')
      await load()
    } catch (error) {
      setStatus(error.message || 'Create category failed')
    }
  }

  const deleteUser = async (userId) => {
    try {
      await api.deleteUser(userId, token)
      setStatus(`Deleted user ${userId}`)
      await load()
    } catch (error) {
      setStatus(error.message || 'Delete user failed')
    }
  }

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>Create Category</Typography>
          <Stack component="form" spacing={2} onSubmit={createCategory}>
            <TextField
              label="Category title"
              value={categoryForm.categoryTitle}
              onChange={(event) => setCategoryForm({ ...categoryForm, categoryTitle: event.target.value })}
              required
            />
            <TextField
              label="Category description"
              multiline
              minRows={3}
              value={categoryForm.categoryDescription}
              onChange={(event) => setCategoryForm({ ...categoryForm, categoryDescription: event.target.value })}
              required
            />
            <Button type="submit" variant="contained">Create</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Users</Typography>
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                disableGutters
                secondaryAction={(
                  <Button size="small" onClick={() => deleteUser(user.id)}>Delete</Button>
                )}
              >
                <ListItemText primary={`${user.name} (${user.email})`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Categories</Typography>
          <List>
            {categories.map((cat) => (
              <ListItem key={cat.categoryId} disableGutters>
                <ListItemText primary={cat.categoryTitle} />
              </ListItem>
            ))}
          </List>
          {status ? <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert> : null}
        </CardContent>
      </Card>
    </Stack>
  )
}
