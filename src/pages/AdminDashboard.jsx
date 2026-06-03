import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState("");

  const stats = {
    totalPatients: 320,
    totalDoctors: 18,
    todayAppointments: 54,
    pendingReports: 12,
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
      summary: "Doctor was in a hurry and did not explain the report properly.",
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
      const res = await authFetch("http://localhost:5000/api/appointments/all");
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
          borderRadius: "24px",
          padding: "18px 22px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "18px",
          boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
          marginBottom: "18px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", opacity: 0.9 }}>Admin panel</div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              margin: "2px 0 6px",
            }}
          >
            Synopsis – Hospital Management Overview
          </h1>
          <p
            style={{
              fontSize: "12px",
              opacity: 0.9,
              maxWidth: "420px",
            }}
          >
            Monitor patients, doctors, appointments, reports and complaints from
            a single dashboard.
          </p>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.25)",
            fontSize: "12px",
            minWidth: "210px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "4px" }}>
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
        <p style={{ color: "#fecaca", fontSize: "13px", marginBottom: "8px" }}>
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
          gap: "16px",
          marginTop: "18px",
        }}
      >
        {/* Latest users */}
        <div className="section">
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Latest users</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "8px 4px" }}>Name</th>
                <th style={{ padding: "8px 4px" }}>Role</th>
                <th style={{ padding: "8px 4px" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 4px" }}>{u.name}</td>
                  <td style={{ padding: "8px 4px" }}>{u.role}</td>
                  <td style={{ padding: "8px 4px" }}>{u.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent appointments + pending reports */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div className="section">
            <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
              Recent appointments
            </h3>

            {loadingAppointments ? (
              <p style={{ fontSize: "12px", color: "#6b7280" }}>Loading...</p>
            ) : appointments.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                No appointments found.
              </p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: "6px 4px" }}>Date</th>
                    <th style={{ padding: "6px 4px" }}>Patient</th>
                    <th style={{ padding: "6px 4px" }}>Doctor</th>
                    <th style={{ padding: "6px 4px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((a) => (
                    <tr key={a._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 4px" }}>
                        {new Date(a.date).toLocaleString()}
                      </td>
                      <td style={{ padding: "6px 4px" }}>{a.patient?.name}</td>
                      <td style={{ padding: "6px 4px" }}>{a.doctor?.name}</td>
                      <td
                        style={{
                          padding: "6px 4px",
                          textTransform: "capitalize",
                        }}
                      >
                        {a.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="section">
            <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
              Pending reports
            </h3>
            {pendingReports.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                No pending reports at the moment.
              </p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: "6px 4px" }}>Patient</th>
                    <th style={{ padding: "6px 4px" }}>Doctor</th>
                    <th style={{ padding: "6px 4px" }}>Report type</th>
                    <th style={{ padding: "6px 4px" }}>Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReports.map((r) => (
                    <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 4px" }}>{r.patient}</td>
                      <td style={{ padding: "6px 4px" }}>{r.doctor}</td>
                      <td style={{ padding: "6px 4px" }}>{r.type}</td>
                      <td style={{ padding: "6px 4px" }}>{r.requested}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Complaints section */}
      <div style={{ marginTop: "18px" }} className="section">
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
          Recent complaints about doctors
        </h3>
        {complaints.length === 0 ? (
          <p style={{ fontSize: "12px", color: "#6b7280" }}>
            No complaints have been submitted.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "8px 4px" }}>Date</th>
                <th style={{ padding: "8px 4px" }}>Patient</th>
                <th style={{ padding: "8px 4px" }}>Doctor</th>
                <th style={{ padding: "8px 4px" }}>Category</th>
                <th style={{ padding: "8px 4px" }}>Summary</th>
                <th style={{ padding: "8px 4px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 4px" }}>{c.date}</td>
                  <td style={{ padding: "8px 4px" }}>{c.patient}</td>
                  <td style={{ padding: "8px 4px" }}>{c.againstDoctor}</td>
                  <td style={{ padding: "8px 4px" }}>{c.category}</td>
                  <td
                    style={{
                      padding: "8px 4px",
                      maxWidth: "260px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.summary}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
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
        )}
      </div>
    </div>
  );
}