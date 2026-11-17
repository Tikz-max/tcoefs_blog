import { Component } from "react";

/** Last line of defence: show a calm message instead of a blank page. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Unhandled error:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center", background: "#f0fdf4", color: "#14532d", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420 }}>
          <img src="/tcoefs-logo.png" alt="" style={{ height: 56, margin: "0 auto 20px" }} />
          <h1 style={{ fontSize: 26, margin: "0 0 10px" }}>Something went wrong</h1>
          <p style={{ margin: "0 0 22px", lineHeight: 1.6, color: "#3f4f5f" }}>
            The page could not be displayed. Please reload; if it keeps happening, contact the TCoEFS team.
          </p>
          <button onClick={() => window.location.reload()} style={{ height: 44, padding: "0 22px", border: 0, borderRadius: 6, background: "#a16207", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
