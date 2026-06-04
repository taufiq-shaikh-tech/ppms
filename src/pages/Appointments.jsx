// src/pages/Appointments.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_ROOT =
  import.meta.env.VITE_API_ROOT || "https://ppms-server-3.onrender.com";

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    date: "",
    doctor: "",
    reason: "",
  });

  const STATIC_DOCTORS = [
    {
      id: "dr_sharma_cardio",
      name: "Dr. Rajesh Sharma",
      specialization: "Cardiologist",
      department: "Cardiology",
      hospital: "City Heart Care",
    },
    {
      id: "dr_verma_neuro",
      name: "Dr. Neha Verma",
      specialization: "Neurologist",
      department: "Neurology",
      hospital: "NeuroPlus Hospital",
    },
    {
      id: "dr_singh_ortho",
      name: "Dr. Amit Singh",
      specialization: "Orthopedic Surgeon",
      department: "Orthopedics",
      hospital: "OrthoCare Clinic",
    },
    {
      id: "dr_khan_pedia",
      name: "Dr. Sana Khan",
      specialization: "Pediatrician",
      department: "Pediatrics",
      hospital: "Children's Health Centre",
    },
  ];

  useEffect(() => {
    const today = new Date();
    const format = (d) => d.toISOString().slice(0, 10);

    const a1 = new Date(today);
    a1.setDate(a1.getDate() + 1);
    const a2 = new Date(today);
    a2.setDate(a2.getDate() + 3);

    const initial = [
      {
        _id: "apt1",
        date: format(a1),
        time: "10:30 AM",
        patient: { name: user?.name || "You" },
        doctorId: STATIC_DOCTORS[0].id,
        reason: "Routine heart checkup",
        status: "confirmed",
      },
      {
        _id: "apt2",
        date: format(a2),
        time: "04:00 PM",
        patient: { name: user?.name || "You" },
        doctorId: STATIC_DOCTORS[1].id,
        reason: "Migraine follow-up",
        status: "pending",
      },
    ];

    setAppointments(initial);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const newAppt = {
        _id: `local_${Date.now()}`,
        date: form.date,
        time: "11:00 AM",
        patient: { name: user?.name || "You" },
        doctorId: form.doctor,
        reason: form.reason || "General consultation",
        status: "pending",
      };

      setAppointments((prev) => [...prev, newAppt]);
      setForm({
        date: "",
        doctor: "",
        reason: "",
      });
    } catch (err) {
      setError("Failed to create appointment (local)");
    } finally {
      setCreating(false);
    }
  };

  const getDoctor = (id) =>
    STATIC_DOCTORS.find((doc) => doc.id === id) || null;

  const getDoctorDisplayShort = (id) => {
    const d = getDoctor(id);
    if (!d) return "-";
    return d.name;
  };

  const getDoctorDisplayFull = (id) => {
    const d = getDoctor(id);
    if (!d) return "-";
    const parts = [d.name];
    if (d.specialization) parts.push(d.specialization);
    if (d.department) parts.push(d.department);
    if (d.hospital) parts.push(d.hospital);
    return parts.join(" • ");
  };

  const handleMessageDoctor = (doctorId) => {
    const d = getDoctor(doctorId);
    navigate("/patient/messages", {
      state: {
        doctorId,
        doctorName: d ? d.name : "Doctor",
      },
    });
  };

  return (
    <div>
      <h1 className="page-title">Appointments</h1>
      <p className="page-subtitle">
        View your upcoming visits and quickly contact your doctor if needed.
      </p>

      {error && (
        <p
          style={{ color: "#b91c1c", fontSize: 13, marginBottom: 6 }}
        >
          {error}
        </p>
      )}

      {user?.role === "patient" && (
        <div className="section" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
            Book new appointment
          </h3>

          <form
            onSubmit={handleCreate}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="input"
              style={{
                minWidth: "min(100%, 140px)",
                flexGrow: 1,
              }}
            />

            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              required
              className="select"
              style={{
                minWidth: "min(100%, 220px)",
                flexGrow: 2,
                backgroundColor: "white",
              }}
            >
              <option value="">Select doctor</option>
              {STATIC_DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {getDoctorDisplayFull(doc.id)}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="reason"
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={handleChange}
              className="input"
              style={{
                flexGrow: 3,
                minWidth: "min(100%, 160px)",
              }}
            />

            <button
              type="submit"
              disabled={creating}
              className="btn btn-primary"
            >
              {creating ? "Booking..." : "Book appointment"}
            </button>
          </form>
        </div>
      )}

      <div className="section">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
          {user?.role === "doctor"
            ? "Appointments with your patients"
            : "Your upcoming appointments"}
        </h3>
        {loading ? (
          <p style={{ fontSize: 12, color: "#6b7280" }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            No appointments yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.date}</td>
                    <td>{a.time || "-"}</td>
                    <td>{getDoctorDisplayShort(a.doctorId)}</td>
                    <td>{a.reason}</td>
                    <td
                      style={{
                        textTransform: "capitalize",
                        color:
                          a.status === "confirmed"
                            ? "#16a34a"
                            : a.status === "cancelled"
                            ? "#b91c1c"
                            : "#92400e",
                        fontWeight: 500,
                      }}
                    >
                      {a.status || "pending"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleMessageDoctor(a.doctorId)}
                        className="btn btn-outline"
                        style={{
                          padding: "4px 10px",
                          fontSize: 11,
                        }}
                      >
                        Message doctor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}