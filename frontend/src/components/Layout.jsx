import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { isAuthenticated, currentUser, logout } = useAuth()

  return (
    <div className="app">
      <header className="header">
        <div className="topRow">
          <Link to="/" className="brand">Blog Frontend</Link>
          <div>
            {currentUser ? <span className="badge">{currentUser.email}</span> : <span className="badge">Guest</span>}
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/posts">Posts</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/user">User</NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button type="button" onClick={logout}>Logout</button>
          )}
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
