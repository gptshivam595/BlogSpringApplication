import {
  Alert,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function PostsPage() {
  const { token, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')

  const loadPosts = useCallback(async (targetPage = 0) => {
    try {
      const data = await api.getPosts(targetPage)
      setPosts(data.content || [])
      setMeta(data)
      setPage(targetPage)
    } catch (error) {
      setStatus(error.message || 'Failed to load posts')
    }
  }, [])

  useEffect(() => {
    loadPosts(0)
  }, [loadPosts])

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!keyword.trim()) {
      await loadPosts(0)
      return
    }

    try {
      const result = await api.searchPosts(keyword.trim())
      setPosts(result)
      setMeta(null)
      setStatus(`Found ${result.length} posts`)
    } catch (error) {
      setStatus(error.message || 'Search failed')
    }
  }

  const deletePost = async (postId) => {
    if (!isAuthenticated) {
      setStatus('Login required to delete post')
      return
    }

    try {
      await api.deletePost(postId, token)
      setStatus(`Deleted post ${postId}`)
      await loadPosts(page)
    } catch (error) {
      setStatus(error.message || 'Delete failed')
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Posts</Typography>

        <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1} onSubmit={handleSearch} sx={{ mb: 2 }}>
          <TextField
            label="Search title"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained">Search</Button>
          <Button type="button" variant="outlined" onClick={() => { setKeyword(''); loadPosts(0) }}>Reset</Button>
        </Stack>

        {meta ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Button disabled={page <= 0} onClick={() => loadPosts(page - 1)}>Prev</Button>
            <Typography variant="body2">Page {meta.pageNumber + 1} / {Math.max(meta.totalPage, 1)}</Typography>
            <Button disabled={meta.lastPage} onClick={() => loadPosts(page + 1)}>Next</Button>
          </Stack>
        ) : null}

        <List>
          {posts.map((post) => (
            <ListItem
              key={post.postId}
              disableGutters
              secondaryAction={(
                <Stack direction="row" spacing={1}>
                  <Button component={Link} to={`/posts/${post.postId}`} size="small" variant="outlined">Details</Button>
                  <IconButton edge="end" onClick={() => deletePost(post.postId)}>
                    🗑
                  </IconButton>
                </Stack>
              )}
            >
              <ListItemText primary={post.title} secondary={`By ${post.user?.name || 'unknown'}`} />
            </ListItem>
          ))}
        </List>

        {status ? <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert> : null}
      </CardContent>
    </Card>
  )
}
