import React from 'react'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you are looking for doesn’t exist or has been moved.</p>
        <a href="/" className="back-home">Go Back Home</a>
      </div>
    </section>
  )
}
