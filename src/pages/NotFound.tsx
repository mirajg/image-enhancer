
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <main className="hero">
        <h1>404</h1>
        <p className="subtitle">This page doesn't exist.</p>
        <Link to="/" className="btn-secondary">← Back to home</Link>
      </main>
    </div>
  );
}