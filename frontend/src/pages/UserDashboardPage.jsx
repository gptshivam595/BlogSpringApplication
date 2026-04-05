import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

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
    <section className="card">
      <h2>User Dashboard</h2>
      <p>Create and manage your own posts.</p>

      <form onSubmit={createPost} className="form">
        <select
          value={form.categoryId}
          onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryTitle}</option>
          ))}
        </select>
        <input
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          placeholder="Title"
          required
        />
        <textarea
          value={form.content}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
          placeholder="Content"
          required
        />
        <button type="submit">Create Post</button>
      </form>

      <h3>My Posts</h3>
      <ul>
        {myPosts.map((post) => (
          <li key={post.postId} className="postRow">
            <span>{post.title}</span>
            <div className="actions">
              <Link className="buttonLike" to={`/posts/${post.postId}`}>Details</Link>
              <button type="button" onClick={() => deletePost(post.postId)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {status ? <p className="statusText">{status}</p> : null}
    </section>
  )
}
