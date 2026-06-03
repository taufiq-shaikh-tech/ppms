import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
       <h2>Suno-Fibo</h2>
        <p>Healthcare dashboard</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px" }}>{user.name}</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>{user.role}</div>
          </div>
        )}
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}