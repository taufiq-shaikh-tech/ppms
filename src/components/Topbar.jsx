// src/components/Topbar.jsx
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <h2>Suno-Fibo</h2>
        <p>Healthcare dashboard</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "capitalize" }}>
              {user.role}
            </div>
          </div>
        )}
        <button
          className="btn-logout"
          onClick={logout}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}