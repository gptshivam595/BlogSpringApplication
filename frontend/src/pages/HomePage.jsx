import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="card">
      <h2>Welcome</h2>
      <p>This is a multi-page frontend connected to your Spring backend APIs.</p>
      <div className="toolbar">
        <Link className="buttonLike" to="/posts">Browse Posts</Link>
        <Link className="buttonLike" to="/login">Login</Link>
        <Link className="buttonLike" to="/register">Register</Link>
      </div>
    </section>
  )
}
