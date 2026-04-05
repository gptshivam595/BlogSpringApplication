import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const TOKEN_KEY = 'blog_token'

function readToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function apiRequest(path, options = {}, token = '') {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function normalizePost(post) {
  if (!post) {
    return post
  }
  const comments = (post.comments || []).map((comment) => ({
    ...comment,
    id: comment.id ?? comment.Id,
    clientKey: comment.id ?? comment.Id ?? crypto.randomUUID(),
  }))
  return { ...post, comments }
}

function App() {
  const [token, setToken] = useState(() => readToken())

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    about: '',
  })
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })

  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)

  const [postPage, setPostPage] = useState(0)
  const [postResponseMeta, setPostResponseMeta] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const [categoryForm, setCategoryForm] = useState({
    categoryTitle: '',
    categoryDescription: '',
  })

  const [postForm, setPostForm] = useState({
    userId: '',
    categoryId: '',
    title: '',
    content: '',
  })

  const [commentForm, setCommentForm] = useState({
    content: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [status, setStatus] = useState('Ready')

  const isAuthenticated = useMemo(() => token.length > 0, [token])

  const setFriendlyError = useCallback((prefix, error) => {
    const payload = safeJsonParse(error.message, {})
    const message = payload?.message || error.message || 'Unknown error'
    setStatus(`${prefix}: ${message}`)
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      const data = await apiRequest('/api/users/', {}, token)
      setUsers(data)
    } catch (error) {
      setFriendlyError('Users load failed', error)
    }
  }, [setFriendlyError, token])

  const loadCategories = useCallback(async () => {
    try {
      const data = await apiRequest('/api/categories/')
      setCategories(data)
    } catch (error) {
      setFriendlyError('Categories load failed', error)
    }
  }, [setFriendlyError])

  const loadPosts = useCallback(async (page = 0) => {
    try {
      const data = await apiRequest(`/api/posts?pageNumber=${page}&pageSize=5&sortBy=postId&sortDir=desc`)
      setPosts(data.content || [])
      setPostResponseMeta(data)
      setPostPage(page)
    } catch (error) {
      setFriendlyError('Posts load failed', error)
    }
  }, [setFriendlyError])

  const loadPostDetails = useCallback(async (postId) => {
    try {
      const data = await apiRequest(`/api/posts/${postId}`)
      setSelectedPost(normalizePost(data))
    } catch (error) {
      setFriendlyError('Post details load failed', error)
    }
  }, [setFriendlyError])

  useEffect(() => {
    loadCategories()
    loadPosts(0)
  }, [loadCategories, loadPosts])

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers()
    }
  }, [isAuthenticated, loadUsers])

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      const data = await apiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(registerForm),
      })
      setStatus(`Registered user: ${data.email}`)
      setRegisterForm({ name: '', email: '', password: '', about: '' })
      await loadUsers()
    } catch (error) {
      setFriendlyError('Register failed', error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const data = await apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })
      saveToken(data.token)
      setToken(data.token)
      setStatus('Logged in')
      await loadUsers()
    } catch (error) {
      setFriendlyError('Login failed', error)
    }
  }

  const handleLogout = () => {
    clearToken()
    setToken('')
    setStatus('Logged out')
    setUsers([])
  }

  const handleCreateCategory = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setStatus('Login required to create category')
      return
    }
    try {
      const data = await apiRequest('/api/categories/', {
        method: 'POST',
        body: JSON.stringify(categoryForm),
      }, token)
      setStatus(`Created category: ${data.categoryTitle}`)
      setCategoryForm({ categoryTitle: '', categoryDescription: '' })
      await loadCategories()
    } catch (error) {
      setFriendlyError('Create category failed', error)
    }
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setStatus('Login required to create post')
      return
    }

    if (!postForm.userId || !postForm.categoryId) {
      setStatus('User ID and Category ID are required')
      return
    }

    try {
      await apiRequest(
        `/api/user/${Number(postForm.userId)}/category/${Number(postForm.categoryId)}/posts`,
        {
          method: 'POST',
          body: JSON.stringify({
            title: postForm.title,
            content: postForm.content,
          }),
        },
        token,
      )
      setStatus('Post created')
      setPostForm({ userId: postForm.userId, categoryId: postForm.categoryId, title: '', content: '' })
      await loadPosts(0)
    } catch (error) {
      setFriendlyError('Create post failed', error)
    }
  }

  const handleSearchPosts = async (event) => {
    event.preventDefault()
    if (!searchKeyword.trim()) {
      await loadPosts(0)
      return
    }

    try {
      const data = await apiRequest(`/api/posts/search/${encodeURIComponent(searchKeyword.trim())}`)
      setPosts(data)
      setPostResponseMeta(null)
      setStatus(`Search results: ${data.length}`)
    } catch (error) {
      setFriendlyError('Search failed', error)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!isAuthenticated) {
      setStatus('Login required to delete post')
      return
    }

    try {
      await apiRequest(`/api/posts/${postId}`, { method: 'DELETE' }, token)
      setStatus(`Deleted post ${postId}`)
      if (selectedPost?.postId === postId) {
        setSelectedPost(null)
      }
      await loadPosts(postPage)
    } catch (error) {
      setFriendlyError('Delete post failed', error)
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!selectedPost?.postId) {
      setStatus('Select a post first')
      return
    }
    if (!isAuthenticated) {
      setStatus('Login required to comment')
      return
    }

    try {
      await apiRequest(
        `/api/posts/${selectedPost.postId}/comments`,
        {
          method: 'POST',
          body: JSON.stringify(commentForm),
        },
        token,
      )
      setCommentForm({ content: '' })
      setStatus('Comment created')
      await loadPostDetails(selectedPost.postId)
    } catch (error) {
      setFriendlyError('Create comment failed', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      setStatus('Login required to delete comment')
      return
    }

    try {
      await apiRequest(`/api/comments/${commentId}`, { method: 'DELETE' }, token)
      setStatus(`Deleted comment ${commentId}`)
      if (selectedPost?.postId) {
        await loadPostDetails(selectedPost.postId)
      }
    } catch (error) {
      setFriendlyError('Delete comment failed', error)
    }
  }

  const handleUploadImage = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setStatus('Login required to upload image')
      return
    }
    if (!selectedPost?.postId || !imageFile) {
      setStatus('Select a post and image file')
      return
    }

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      await apiRequest(`/api/posts/image/upload/${selectedPost.postId}`, {
        method: 'POST',
        body: formData,
      }, token)
      setStatus('Image uploaded')
      setImageFile(null)
      await loadPostDetails(selectedPost.postId)
      await loadPosts(postPage)
    } catch (error) {
      setFriendlyError('Image upload failed', error)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Blog Frontend</h1>
        <p>Connected to Spring Boot backend APIs</p>
        <div className="status">{status}</div>
        <div className="toolbar">
          <button onClick={() => loadPosts(postPage)}>Refresh Posts</button>
          <button onClick={loadCategories}>Refresh Categories</button>
          {isAuthenticated ? (
            <button onClick={handleLogout}>Logout</button>
          ) : null}
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Auth</h2>
          <form onSubmit={handleRegister} className="form">
            <h3>Register</h3>
            <input
              placeholder="Name"
              value={registerForm.name}
              onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={registerForm.email}
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={registerForm.password}
              onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
              required
            />
            <textarea
              placeholder="About"
              value={registerForm.about}
              onChange={(event) => setRegisterForm({ ...registerForm, about: event.target.value })}
              required
            />
            <button type="submit">Register</button>
          </form>

          <form onSubmit={handleLogin} className="form">
            <h3>Login</h3>
            <input
              placeholder="Username (email)"
              value={loginForm.username}
              onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>

          <div>
            <h3>Token State</h3>
            <p>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
          </div>
        </section>

        <section className="card">
          <h2>Users</h2>
          <p>GET /api/users/</p>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <b>{user.name}</b> (id: {user.id}) - {user.email}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Categories</h2>
          <form onSubmit={handleCreateCategory} className="form">
            <input
              placeholder="Category title"
              value={categoryForm.categoryTitle}
              onChange={(event) => setCategoryForm({ ...categoryForm, categoryTitle: event.target.value })}
              required
            />
            <textarea
              placeholder="Category description"
              value={categoryForm.categoryDescription}
              onChange={(event) => setCategoryForm({ ...categoryForm, categoryDescription: event.target.value })}
              required
            />
            <button type="submit">Create Category</button>
          </form>
          <ul>
            {categories.map((category) => (
              <li key={category.categoryId}>
                <b>{category.categoryTitle}</b> (id: {category.categoryId})
              </li>
            ))}
          </ul>
        </section>

        <section className="card wide">
          <h2>Posts</h2>
          <form onSubmit={handleSearchPosts} className="rowForm">
            <input
              placeholder="Search title"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={async () => {
                setSearchKeyword('')
                await loadPosts(0)
              }}
            >
              Reset
            </button>
          </form>

          <form onSubmit={handleCreatePost} className="form">
            <h3>Create Post</h3>
            <input
              placeholder="User ID"
              type="number"
              value={postForm.userId}
              onChange={(event) => setPostForm({ ...postForm, userId: event.target.value })}
              required
            />
            <input
              placeholder="Category ID"
              type="number"
              value={postForm.categoryId}
              onChange={(event) => setPostForm({ ...postForm, categoryId: event.target.value })}
              required
            />
            <input
              placeholder="Title"
              value={postForm.title}
              onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              value={postForm.content}
              onChange={(event) => setPostForm({ ...postForm, content: event.target.value })}
              required
            />
            <button type="submit">Create Post</button>
          </form>

          {postResponseMeta ? (
            <div className="pager">
              <button
                disabled={postPage <= 0}
                onClick={() => loadPosts(Math.max(0, postPage - 1))}
              >
                Prev
              </button>
              <span>
                Page {postResponseMeta.pageNumber + 1} / {Math.max(postResponseMeta.totalPage, 1)}
              </span>
              <button
                disabled={postResponseMeta.lastPage}
                onClick={() => loadPosts(postPage + 1)}
              >
                Next
              </button>
            </div>
          ) : null}

          <ul>
            {posts.map((post) => (
              <li key={post.postId} className="postRow">
                <div>
                  <b>{post.title}</b> (id: {post.postId}) by {post.user?.name || 'unknown'}
                </div>
                <div className="actions">
                  <button onClick={() => loadPostDetails(post.postId)}>View</button>
                  <button onClick={() => handleDeletePost(post.postId)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card wide">
          <h2>Post Details + Comments</h2>
          {selectedPost ? (
            <>
              <h3>
                {selectedPost.title} (#{selectedPost.postId})
              </h3>
              <p>{selectedPost.content}</p>
              <p>Category: {selectedPost.category?.categoryTitle}</p>
              <p>Author: {selectedPost.user?.name}</p>
              <p>Image: {selectedPost.imageName || 'none'}</p>

              <form onSubmit={handleUploadImage} className="rowForm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                />
                <button type="submit">Upload Image</button>
              </form>

              <form onSubmit={handleAddComment} className="rowForm">
                <input
                  placeholder="Comment text"
                  value={commentForm.content}
                  onChange={(event) => setCommentForm({ content: event.target.value })}
                  required
                />
                <button type="submit">Add Comment</button>
              </form>

              <ul>
                {(selectedPost.comments || []).map((comment) => (
                  <li key={comment.clientKey} className="postRow">
                    <span>{comment.content}</span>
                    <button disabled={!comment.id} onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Select a post from Posts section.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
