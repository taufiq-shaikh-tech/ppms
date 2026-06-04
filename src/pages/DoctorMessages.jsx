// src/pages/DoctorMessages.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DoctorMessages() {
  const { user } = useAuth();
  const location = useLocation();

  // Appointments se aaya hua patient info
  const selectedPatientId = location.state?.patientId || null;
  const selectedPatientName =
    location.state?.patientName || "Select a patient";

  // Left side patients (simple static list + selected patient)
  const BASE_PATIENTS = [
    { id: "pt_rahul", name: "Rahul Mehta" },
    { id: "pt_ananya", name: "Ananya Gupta" },
    { id: "pt_ayush", name: "Ayush Singh" },
  ];

  // Unique patients list, taki selectedPatient bhi include ho jaye
  const patients = (() => {
    const list = [...BASE_PATIENTS];
    if (
      selectedPatientId &&
      !list.some((p) => p.id === selectedPatientId)
    ) {
      list.unshift({ id: selectedPatientId, name: selectedPatientName });
    }
    return list;
  })();

  const [activePatientId, setActivePatientId] = useState(selectedPatientId);
  const [activePatientName, setActivePatientName] =
    useState(selectedPatientName);

  // Simple local messages per patient (front‑end only)
  const [messagesByPatient, setMessagesByPatient] = useState({});
  const [input, setInput] = useState("");

  useEffect(() => {
    if (selectedPatientId) {
      setActivePatientId(selectedPatientId);
      setActivePatientName(selectedPatientName);

      // Agar us patient ke लिए koi existing dummy messages nahi hain to seed karo
      setMessagesByPatient((prev) => {
        if (prev[selectedPatientId]) return prev;
        return {
          ...prev,
          [selectedPatientId]: [
            {
              id: "m1",
              from: "patient",
              text: `Hello Doctor, I had a question about my appointment.`,
              at: "09:45 AM",
            },
            {
              id: "m2",
              from: "doctor",
              text: `Sure, ${selectedPatientName.split(" ")[0]}, please go ahead.`,
              at: "09:47 AM",
            },
          ],
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId, selectedPatientName]);

  const currentMessages = activePatientId
    ? messagesByPatient[activePatientId] || []
    : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!activePatientId || !input.trim()) return;

    const text = input.trim();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessagesByPatient((prev) => {
      const list = prev[activePatientId] || [];
      return {
        ...prev,
        [activePatientId]: [
          ...list,
          {
            id: `msg_${Date.now()}`,
            from: "doctor",
            text,
            at: time,
          },
        ],
      };
    });

    setInput("");
  };

  const handleSelectPatient = (p) => {
    setActivePatientId(p.id);
    setActivePatientName(p.name);
    // Ensure messages object me entry ho
    setMessagesByPatient((prev) => ({
      ...prev,
      [p.id]: prev[p.id] || [],
    }));
  };

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <p className="page-subtitle">
        Chat with your patients about their appointments and follow-ups.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          height: 400,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* LEFT: Patient list */}
        <div
          style={{
            width: 220,
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid #e5e7eb",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#6b7280",
            }}
          >
            Patients
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPatient(p)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  border: "none",
                  borderBottom: "1px solid #f3f4f6",
                  backgroundColor:
                    activePatientId === p.id ? "#eff6ff" : "white",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginTop: 2,
                  }}
                >
                  Tap to chat
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Chat area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                {activePatientId ? activePatientName : "Select a patient"}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {activePatientId
                  ? `Chat as ${user?.name || "Doctor"}`
                  : "Choose a patient from the left to start chat"}
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div
            style={{
              flex: 1,
              padding: "8px 12px",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {!activePatientId ? (
              <p style={{ fontSize: 12, color: "#9ca3af" }}>
                No patient selected. Choose a patient from the left panel to
                start messaging.
              </p>
            ) : currentMessages.length === 0 ? (
              <p style={{ fontSize: 12, color: "#9ca3af" }}>
                No messages yet. Say hello to {activePatientName}.
              </p>
            ) : (
              currentMessages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.from === "doctor" ? "flex-end" : "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "6px 8px",
                      borderRadius: 10,
                      fontSize: 12,
                      backgroundColor:
                        m.from === "doctor" ? "#2563eb" : "white",
                      color: m.from === "doctor" ? "white" : "#111827",
                      border:
                        m.from === "doctor"
                          ? "none"
                          : "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ marginBottom: 2 }}>{m.text}</div>
                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                        textAlign: "right",
                      }}
                    >
                      {m.at}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "6px 8px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: 6,
            }}
          >
            <input
              type="text"
              placeholder={
                activePatientId
                  ? `Message ${activePatientName}...`
                  : "Select a patient to start chatting"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!activePatientId}
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "6px 10px",
                fontSize: 12,
                backgroundColor: activePatientId ? "white" : "#f3f4f6",
              }}
            />
            <button
              type="submit"
              disabled={!activePatientId || !input.trim()}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background:
                  !activePatientId || !input.trim()
                    ? "#9ca3af"
                    : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                fontSize: 12,
                cursor:
                  !activePatientId || !input.trim()
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}