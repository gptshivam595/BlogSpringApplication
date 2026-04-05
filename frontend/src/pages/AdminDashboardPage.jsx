import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

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
    <section className="card">
      <h2>Admin Dashboard</h2>

      <form onSubmit={createCategory} className="form">
        <h3>Create Category</h3>
        <input
          value={categoryForm.categoryTitle}
          onChange={(event) => setCategoryForm({ ...categoryForm, categoryTitle: event.target.value })}
          placeholder="Category title"
          required
        />
        <textarea
          value={categoryForm.categoryDescription}
          onChange={(event) => setCategoryForm({ ...categoryForm, categoryDescription: event.target.value })}
          placeholder="Category description"
          required
        />
        <button type="submit">Create</button>
      </form>

      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="postRow">
            <span>{user.name} ({user.email})</span>
            <button type="button" onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.categoryId}>{cat.categoryTitle}</li>
        ))}
      </ul>
      {status ? <p className="statusText">{status}</p> : null}
    </section>
  )
}
