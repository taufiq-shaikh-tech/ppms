// src/pages/Appointments.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Appointments() {
  const { authFetch, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch("http://localhost:5000/api/appointments/my");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load appointments");
      }
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    if (user?.role !== "patient") return;
    try {
      const res = await authFetch("http://localhost:5000/api/users/doctors");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load doctors");
      }
      setDoctors(data);
    } catch (err) {
      console.error("Load doctors error", err);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      if (!form.doctorId || !form.date || !form.time || !form.reason) {
        throw new Error("All fields are required");
      }

      const isoDate = new Date(`${form.date}T${form.time}:00`);

      const res = await authFetch("http://localhost:5000/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctor: form.doctorId,
          date: isoDate.toISOString(),
          reason: form.reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      setForm({ doctorId: "", date: "", time: "", reason: "" });
      loadAppointments();
    } catch (err) {
      setError(err.message || "Failed to create appointment");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: "16px 20px", color: "#e5e7eb" }}>
      <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>
        Appointments ({user?.role})
      </h1>

      {error && (
        <p style={{ color: "#fecaca", fontSize: "13px", marginBottom: "8px" }}>
          {error}
        </p>
      )}

      {/* Create appointment form – visible only for patients */}
      {user?.role === "patient" && (
        <div
          style={{
            background: "#020617",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "16px",
            border: "1px solid #1f2937",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              marginBottom: "10px",
              color: "#f9fafb",
            }}
          >
            Book a new appointment
          </h2>

          <form
            onSubmit={handleCreate}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <label style={{ fontSize: "12px" }}>
                Doctor
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    borderRadius: 999,
                    border: "1px solid #4b5563",
                    fontSize: "12px",
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} ({doc.email})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label style={{ fontSize: "12px" }}>
                Date
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    borderRadius: 999,
                    border: "1px solid #4b5563",
                    fontSize: "12px",
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>
            </div>

            <div>
              <label style={{ fontSize: "12px" }}>
                Time
                <input
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    borderRadius: 999,
                    border: "1px solid #4b5563",
                    fontSize: "12px",
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>
            </div>

            <div>
              <label style={{ fontSize: "12px" }}>
                Reason
                <input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Short description"
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    borderRadius: 999,
                    border: "1px solid #4b5563",
                    fontSize: "12px",
                    background: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>
            </div>

            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <button
                type="submit"
                disabled={creating}
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: "none",
                  background: creating
                    ? "#4b5563"
                    : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                  color: "#f9fafb",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: creating ? "not-allowed" : "pointer",
                }}
              >
                {creating ? "Booking..." : "Book appointment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments list */}
      <div
        style={{
          background: "#020617",
          borderRadius: "12px",
          padding: "14px 16px",
          border: "1px solid #1f2937",
        }}
      >
        <h2
          style={{
            fontSize: "15px",
            marginBottom: "10px",
            color: "#f9fafb",
          }}
        >
          My appointments
        </h2>

        {loading ? (
          <p style={{ fontSize: "13px" }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p style={{ fontSize: "13px", opacity: 0.7 }}>
            No appointments yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              fontSize: "12px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #1f2937",
                }}
              >
                <th style={{ padding: "6px 4px" }}>Date</th>
                <th style={{ padding: "6px 4px" }}>Doctor</th>
                <th style={{ padding: "6px 4px" }}>Patient</th>
                <th style={{ padding: "6px 4px" }}>Reason</th>
                <th style={{ padding: "6px 4px" }}>Status</th>
                <th style={{ padding: "6px 4px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr
                  key={a._id}
                  style={{ borderBottom: "1px solid #0f172a" }}
                >
                  <td style={{ padding: "6px 4px" }}>
                    {new Date(a.date).toLocaleString()}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{a.doctor?.name}</td>
                  <td style={{ padding: "6px 4px" }}>{a.patient?.name}</td>
                  <td style={{ padding: "6px 4px" }}>{a.reason}</td>
                  <td
                    style={{
                      padding: "6px 4px",
                      textTransform: "capitalize",
                    }}
                  >
                    {a.status}
                  </td>
                  <td style={{ padding: "6px 4px" }}>
                    {user?.role === "patient" && a.doctor?._id && (
                      <a
                        href={`/patient/messages?with=${a.doctor._id}`}
                        style={{
                          fontSize: "11px",
                          padding: "4px 8px",
                          borderRadius: 999,
                          border: "1px solid #1d4ed8",
                          color: "#bfdbfe",
                          textDecoration: "none",
                          background: "rgba(37,99,235,0.1)",
                        }}
                      >
                        Message doctor
                      </a>
                    )}
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