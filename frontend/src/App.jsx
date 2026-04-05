import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { RequireAuth, RequireRole } from './components/RouteGuards'
import { useAuth } from './context/AuthContext'
import AdminDashboardPage from './pages/AdminDashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PostDetailPage from './pages/PostDetailPage'
import PostsPage from './pages/PostsPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboardPage from './pages/UserDashboardPage'

function App() {
  const { refreshCurrentUser } = useAuth()

  useEffect(() => {
    refreshCurrentUser()
  }, [refreshCurrentUser])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/:postId" element={<PostDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route
          path="user"
          element={(
            <RequireRole roles={['ROLE_NORMAL', 'ROLE_ADMIN']}>
              <UserDashboardPage />
            </RequireRole>
          )}
        />

        <Route
          path="admin"
          element={(
            <RequireRole roles={['ROLE_ADMIN']}>
              <AdminDashboardPage />
            </RequireRole>
          )}
        />

        <Route
          path="protected"
          element={(
            <RequireAuth>
              <div className="card"><h2>Protected</h2><p>You are authenticated.</p></div>
            </RequireAuth>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
