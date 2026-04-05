import {
  Alert,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function UserDashboardPage() {
  const { currentUser, token, isAuthenticated } = useAuth()
  const userId = useMemo(() => currentUser?.id, [currentUser])

  const [categories, setCategories] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [form, setForm] = useState({ categoryId: '', title: '', content: '' })
  const [status, setStatus] = useState('')

  const load = useCallback(async () => {
    try {
      const cats = await api.getCategories()
      setCategories(cats)
    } catch {
      setCategories([])
    }

    if (!userId) {
      setMyPosts([])
      return
    }

    try {
      const posts = await api.getPostsByUser(userId)
      setMyPosts(posts)
    } catch (error) {
      setStatus(error.message || 'Could not load your posts')
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const createPost = async (event) => {
    event.preventDefault()
    if (!isAuthenticated || !userId) {
      setStatus('Login required')
      return
    }

    try {
      await api.createPost(userId, form.categoryId, { title: form.title, content: form.content }, token)
      setForm({ categoryId: '', title: '', content: '' })
      setStatus('Post created')
      await load()
    } catch (error) {
      setStatus(error.message || 'Create post failed')
    }
  }

  const deletePost = async (postId) => {
    try {
      await api.deletePost(postId, token)
      setStatus(`Deleted post ${postId}`)
      await load()
    } catch (error) {
      setStatus(error.message || 'Delete failed')
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>User Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Create and manage your own posts.</Typography>

        <Stack component="form" spacing={2} onSubmit={createPost} sx={{ mb: 2 }}>
          <TextField
            select
            label="Category"
            value={form.categoryId}
            onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
            required
          >
            <MenuItem value="">Select category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.categoryTitle}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />

          <TextField
            label="Content"
            multiline
            minRows={3}
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            required
          />

          <Button type="submit" variant="contained">Create Post</Button>
        </Stack>

        <Typography variant="h6" sx={{ mb: 1 }}>My Posts</Typography>
        <List>
          {myPosts.map((post) => (
            <ListItem
              key={post.postId}
              disableGutters
              secondaryAction={(
                <Stack direction="row" spacing={1}>
                  <Button component={Link} to={`/posts/${post.postId}`} size="small" variant="outlined">Details</Button>
                  <Button size="small" onClick={() => deletePost(post.postId)}>Delete</Button>
                </Stack>
              )}
            >
              <ListItemText primary={post.title} />
            </ListItem>
          ))}
        </List>

        {status ? <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert> : null}
      </CardContent>
    </Card>
  )
}
