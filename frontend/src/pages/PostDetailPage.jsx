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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

function normalizePost(post) {
  if (!post) {
    return null
  }

  return {
    ...post,
    comments: (post.comments || []).map((comment) => ({
      ...comment,
      id: comment.id ?? comment.Id,
      clientKey: comment.id ?? comment.Id ?? crypto.randomUUID(),
    })),
  }
}

export default function PostDetailPage() {
  const { postId } = useParams()
  const parsedPostId = useMemo(() => Number(postId), [postId])
  const { token, isAuthenticated } = useAuth()

  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [status, setStatus] = useState('')

  const loadPost = useCallback(async () => {
    if (!parsedPostId) {
      return
    }
    try {
      const data = await api.getPostById(parsedPostId)
      setPost(normalizePost(data))
    } catch (error) {
      setStatus(error.message || 'Failed to load post')
    }
  }, [parsedPostId])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  const addComment = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setStatus('Login required to comment')
      return
    }

    try {
      await api.createComment(parsedPostId, { content: comment }, token)
      setComment('')
      setStatus('Comment added')
      await loadPost()
    } catch (error) {
      setStatus(error.message || 'Failed to add comment')
    }
  }

  const removeComment = async (commentId) => {
    if (!isAuthenticated) {
      setStatus('Login required to delete comment')
      return
    }
    if (!commentId) {
      return
    }

    try {
      await api.deleteComment(commentId, token)
      setStatus('Comment deleted')
      await loadPost()
    } catch (error) {
      setStatus(error.message || 'Failed to delete comment')
    }
  }

  const uploadImage = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setStatus('Login required to upload image')
      return
    }
    if (!imageFile) {
      setStatus('Choose an image first')
      return
    }

    try {
      await api.uploadPostImage(parsedPostId, imageFile, token)
      setStatus('Image uploaded')
      setImageFile(null)
      await loadPost()
    } catch (error) {
      setStatus(error.message || 'Image upload failed')
    }
  }

  if (!post) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Post Details</Typography>
          <Typography color="text.secondary">Loading...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>{post.title}</Typography>
        <Typography sx={{ mb: 1 }}>{post.content}</Typography>
        <Typography variant="body2" color="text.secondary">Category: {post.category?.categoryTitle}</Typography>
        <Typography variant="body2" color="text.secondary">Author: {post.user?.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Image: {post.imageName || 'none'}</Typography>

        <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1} onSubmit={uploadImage} sx={{ mb: 2 }}>
          <Button component="label" variant="outlined">
            Choose Image
            <input hidden type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </Button>
          <Button type="submit" variant="contained">Upload Image</Button>
        </Stack>

        <Typography variant="h6" sx={{ mb: 1 }}>Comments</Typography>
        <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1} onSubmit={addComment} sx={{ mb: 2 }}>
          <TextField
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment"
            required
            fullWidth
          />
          <Button type="submit" variant="contained">Add</Button>
        </Stack>

        <List>
          {(post.comments || []).map((item) => (
            <ListItem
              key={item.clientKey}
              disableGutters
              secondaryAction={(
                <Button size="small" disabled={!item.id} onClick={() => removeComment(item.id)}>
                  Delete
                </Button>
              )}
            >
              <ListItemText primary={item.content} />
            </ListItem>
          ))}
        </List>

        {status ? <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert> : null}
      </CardContent>
    </Card>
  )
}
