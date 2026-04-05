import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

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
    return <section className="card"><h2>Post Details</h2><p>Loading...</p></section>
  }

  return (
    <section className="card">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Category: {post.category?.categoryTitle}</p>
      <p>Author: {post.user?.name}</p>
      <p>Image: {post.imageName || 'none'}</p>

      <form onSubmit={uploadImage} className="rowForm">
        <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        <button type="submit">Upload Image</button>
      </form>

      <h3>Comments</h3>
      <form onSubmit={addComment} className="rowForm">
        <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {(post.comments || []).map((item) => (
          <li key={item.clientKey} className="postRow">
            <span>{item.content}</span>
            <button type="button" disabled={!item.id} onClick={() => removeComment(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {status ? <p className="statusText">{status}</p> : null}
    </section>
  )
}
