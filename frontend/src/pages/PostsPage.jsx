import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

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
    <section className="card">
      <h2>Posts</h2>
      <form onSubmit={handleSearch} className="rowForm">
        <input
          placeholder="Search title"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setKeyword(''); loadPosts(0) }}>Reset</button>
      </form>

      {meta ? (
        <div className="pager">
          <button disabled={page <= 0} onClick={() => loadPosts(page - 1)}>Prev</button>
          <span>Page {meta.pageNumber + 1} / {Math.max(meta.totalPage, 1)}</span>
          <button disabled={meta.lastPage} onClick={() => loadPosts(page + 1)}>Next</button>
        </div>
      ) : null}

      <ul>
        {posts.map((post) => (
          <li key={post.postId} className="postRow">
            <span>
              <b>{post.title}</b> by {post.user?.name || 'unknown'}
            </span>
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
