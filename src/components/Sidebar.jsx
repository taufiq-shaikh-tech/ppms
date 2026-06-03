import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  let base = "/";
  let links = [];

  if (user.role === "patient") {
    base = "/patient";
    links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/profile", label: "Profile" },
      { to: "/reports", label: "Reports" },
      { to: "/appointments", label: "Appointments" },
      { to: "/messages", label: "Messages" },
      { to: "/complaints", label: "Complaints" }, // NEW
    ];
  } else if (user.role === "doctor") {
    base = "/doctor";
    links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/patients", label: "My Patients" },
      { to: "/appointments", label: "Appointments" },
      { to: "/profile", label: "My Profile" },
    ];
  } else if (user.role === "admin") {
    base = "/admin";
    links = [{ to: "/dashboard", label: "Dashboard" }];
  }

  return (
    <aside className="sidebar">
      <h1>Sun-Fibo</h1>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={base + link.to}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#0ea5e9" : "transparent",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}