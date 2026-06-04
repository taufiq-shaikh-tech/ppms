// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_ROOT =
  import.meta.env.VITE_API_ROOT || "https://ppms-server.onrender.com";

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState("");

  const stats = {
    totalPatients: 3,
    totalDoctors: 4,
    todayAppointments: 2,
    pendingReports: 1,
  };

  const latestUsers = [
    { id: 1, name: "Rahul Patil", role: "Patient", created: "28 May 2026" },
    { id: 2, name: "Dr. Neha Sharma", role: "Doctor", created: "27 May 2026" },
    { id: 3, name: "Sunil Gupta", role: "Patient", created: "27 May 2026" },
  ];

  const pendingReports = [
    {
      id: 1,
      patient: "Rahul Patil",
      doctor: "Dr. Neha Sharma",
      type: "CBC Report",
      requested: "28 May 2026",
    },
    {
      id: 2,
      patient: "Ravi Shinde",
      doctor: "Dr. Arjun Mehta",
      type: "X-Ray Chest",
      requested: "27 May 2026",
    },
  ];

  const complaints = [
    {
      id: 1,
      date: "28 May 2026",
      patient: "Rahul Patil",
      againstDoctor: "Dr. Arjun Mehta",
      category: "Behaviour",
      summary:
        "Doctor was in a hurry and did not explain the report properly.",
      status: "Open",
    },
    {
      id: 2,
      date: "27 May 2026",
      patient: "Sneha Joshi",
      againstDoctor: "Dr. Neha Sharma",
      category: "Delay",
      summary: "Appointment was delayed by more than 40 minutes.",
      status: "In review",
    },
  ];

  const loadAppointments = async () => {
    setLoadingAppointments(true);
    setError("");
    try {
      const res = await authFetch(`${API_ROOT}/api/appointments/all`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load appointments");
      }
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "8px 4px" }}>
      {/* HERO – admin overview */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f66d1,#1d4ed8)",
          borderRadius: 24,
          padding: "18px 22px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 18,
          boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 220, flex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Admin panel</div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "2px 0 6px",
            }}
          >
            Sun-Fibo - Overview
          </h1>
          <p
            style={{
              fontSize: 12,
              opacity: 0.9,
              maxWidth: 420,
            }}
          >
            Monitor patients, doctors, appointments, reports and complaints from
            a single dashboard.
          </p>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 18,
            background: "rgba(15,23,42,0.25)",
            fontSize: 12,
            minWidth: 210,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Today&apos;s summary
          </div>
          <div style={{ opacity: 0.9 }}>
            Patients: <b>{stats.totalPatients}</b>
            <br />
            Doctors: <b>{stats.totalDoctors}</b>
            <br />
            Appointments today: <b>{stats.todayAppointments}</b>
          </div>
        </div>
      </div>

      {/* Error global (mainly for appointments) */}
      {error && (
        <p
          style={{ color: "#fecaca", fontSize: 13, marginBottom: 8 }}
        >
          {error}
        </p>
      )}

      {/* KPI cards */}
      <div className="cards-grid">
        <div className="card">
          <p className="card-title">Total patients</p>
          <p className="card-value">{stats.totalPatients}</p>
        </div>
        <div className="card">
          <p className="card-title">Total doctors</p>
          <p className="card-value">{stats.totalDoctors}</p>
        </div>
        <div className="card">
          <p className="card-title">Today&apos;s appointments</p>
          <p className="card-value">{stats.todayAppointments}</p>
        </div>
        <div className="card">
          <p className="card-title">Pending reports</p>
          <p className="card-value">{stats.pendingReports}</p>
        </div>
      </div>

      {/* Middle: users + appointments */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1.6fr",
          gap: 16,
          marginTop: 18,
        }}
      >
        {/* Latest users */}
        <div className="section">
          <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
            Latest users
          </h3>
          <div className="table-responsive">
            <table
              className="table"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {latestUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.role}</td>
                    <td>{u.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent appointments + pending reports */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: 12,
          }}
        >
          <div className="section">
            <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
              Recent appointments
            </h3>

            {loadingAppointments ? (
              <p style={{ fontSize: 12, color: "#6b7280" }}>Loading...</p>
            ) : appointments.length === 0 ? (
              <p style={{ fontSize: 12, color: "#6b7280" }}>
                No appointments found.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((a) => (
                      <tr key={a._id}>
                        <td>{new Date(a.date).toLocaleString()}</td>
                        <td>{a.patient?.name}</td>
                        <td>{a.doctor?.name}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {a.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="section">
            <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
              Pending reports
            </h3>
            {pendingReports.length === 0 ? (
              <p style={{ fontSize: 12, color: "#6b7280" }}>
                No pending reports at the moment.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Report type</th>
                      <th>Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReports.map((r) => (
                      <tr key={r.id}>
                        <td>{r.patient}</td>
                        <td>{r.doctor}</td>
                        <td>{r.type}</td>
                        <td>{r.requested}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaints section */}
      <div style={{ marginTop: 18 }} className="section">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
          Recent complaints about doctors
        </h3>
        {complaints.length === 0 ? (
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            No complaints have been submitted.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Category</th>
                  <th>Summary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.date}</td>
                    <td>{c.patient}</td>
                    <td>{c.againstDoctor}</td>
                    <td>{c.category}</td>
                    <td
                      style={{
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.summary}
                    </td>
                    <td
                      style={{
                        color:
                          c.status === "Open"
                            ? "#b91c1c"
                            : c.status === "In review"
                            ? "#b45309"
                            : "#15803d",
                        fontWeight: 600,
                      }}
                    >
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile: stack middle columns */}
      <style>
        {`
          @media (max-width: 900px) {
            .admin-middle-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}