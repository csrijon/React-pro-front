import { Component } from 'react'

/** Last line of defence: a render crash shows a friendly screen instead of a blank page. */
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error, info) { console.error('UI crashed:', error, info?.componentStack) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center', background: '#0B0D10', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#A7ADB5', maxWidth: 380, margin: 0 }}>An unexpected error occurred. Reloading usually fixes it.</p>
        <button onClick={() => window.location.assign('/')} style={{ background: '#EF252B', color: '#fff', border: 0, borderRadius: 8, padding: '12px 20px', fontWeight: 600, cursor: 'pointer' }}>Back to home</button>
      </div>
    )
  }
}
