// src/pages/PatientMessages.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PatientMessages() {
  const { user } = useAuth();
  const location = useLocation();

  // Appointments se aaya hua doctor info
  const selectedDoctorId = location.state?.doctorId || null;
  const selectedDoctorName = location.state?.doctorName || "Select a doctor";

  // Left side doctors (simple static list + selected doctor)
  const BASE_DOCTORS = [
    { id: "dr_sharma_cardio", name: "Dr. Rajesh Sharma" },
    { id: "dr_verma_neuro", name: "Dr. Neha Verma" },
    { id: "dr_singh_ortho", name: "Dr. Amit Singh" },
    { id: "dr_khan_pedia", name: "Dr. Sana Khan" },
  ];

  // Unique doctors list, taki selectedDoctor bhi include ho jaye
  const doctors = (() => {
    const list = [...BASE_DOCTORS];
    if (
      selectedDoctorId &&
      !list.some((d) => d.id === selectedDoctorId)
    ) {
      list.unshift({ id: selectedDoctorId, name: selectedDoctorName });
    }
    return list;
  })();

  const [activeDoctorId, setActiveDoctorId] = useState(selectedDoctorId);
  const [activeDoctorName, setActiveDoctorName] = useState(selectedDoctorName);

  // Simple local messages per doctor (front‑end only)
  const [messagesByDoctor, setMessagesByDoctor] = useState({});
  const [input, setInput] = useState("");

  useEffect(() => {
    if (selectedDoctorId) {
      setActiveDoctorId(selectedDoctorId);
      setActiveDoctorName(selectedDoctorName);

      // Agar us doctor ke लिए koi existing dummy messages nahi hain to seed karo
      setMessagesByDoctor((prev) => {
        if (prev[selectedDoctorId]) return prev;
        return {
          ...prev,
          [selectedDoctorId]: [
            {
              id: "m1",
              from: "doctor",
              text: `Hello ${user?.name || "patient"}, how can I help you today?`,
              at: "10:00 AM",
            },
          ],
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctorId, selectedDoctorName]);

  const currentMessages = activeDoctorId
    ? messagesByDoctor[activeDoctorId] || []
    : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!activeDoctorId || !input.trim()) return;

    const text = input.trim();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessagesByDoctor((prev) => {
      const list = prev[activeDoctorId] || [];
      return {
        ...prev,
        [activeDoctorId]: [
          ...list,
          {
            id: `msg_${Date.now()}`,
            from: "patient",
            text,
            at: time,
          },
        ],
      };
    });

    setInput("");
  };

  const handleSelectDoctor = (doc) => {
    setActiveDoctorId(doc.id);
    setActiveDoctorName(doc.name);
    // Ensure messages object me entry ho
    setMessagesByDoctor((prev) => ({
      ...prev,
      [doc.id]: prev[doc.id] || [],
    }));
  };

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <p className="page-subtitle">
        Chat with your doctors about your appointments and follow-ups.
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
        {/* LEFT: Doctor list */}
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
            Doctors
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {doctors.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleSelectDoctor(doc)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  border: "none",
                  borderBottom: "1px solid #f3f4f6",
                  backgroundColor:
                    activeDoctorId === doc.id ? "#eff6ff" : "white",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{doc.name}</div>
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
                {activeDoctorId ? activeDoctorName : "Select a doctor"}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {activeDoctorId
                  ? "Secure chat about your appointments"
                  : "Choose a doctor from the left to start chat"}
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
            {!activeDoctorId ? (
              <p style={{ fontSize: 12, color: "#9ca3af" }}>
                No doctor selected. Choose a doctor from the left panel to
                start messaging.
              </p>
            ) : currentMessages.length === 0 ? (
              <p style={{ fontSize: 12, color: "#9ca3af" }}>
                No messages yet. Say hello to {activeDoctorName}.
              </p>
            ) : (
              currentMessages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.from === "patient" ? "flex-end" : "flex-start",
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
                        m.from === "patient" ? "#2563eb" : "white",
                      color: m.from === "patient" ? "white" : "#111827",
                      border:
                        m.from === "patient"
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
                activeDoctorId
                  ? `Message ${activeDoctorName}...`
                  : "Select a doctor to start chatting"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!activeDoctorId}
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "6px 10px",
                fontSize: 12,
                backgroundColor: activeDoctorId ? "white" : "#f3f4f6",
              }}
            />
            <button
              type="submit"
              disabled={!activeDoctorId || !input.trim()}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background:
                  !activeDoctorId || !input.trim()
                    ? "#9ca3af"
                    : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                fontSize: 12,
                cursor:
                  !activeDoctorId || !input.trim()
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