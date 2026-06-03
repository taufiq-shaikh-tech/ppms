// src/components/FloatingHealthChatbot.jsx
import { useState } from "react";

const CONDITIONS = [
  {
    key: "fever",
    label: "Fever",
    reply:
      "For mild fever, rest and plenty of fluids usually help. You can take paracetamol 500 mg every 6–8 hours if you have no allergy and your doctor has allowed it before. If fever is above 101°F, lasts more than 2 days, or you have breathing difficulty, please see a doctor in person.",
  },
  {
    key: "cold",
    label: "Common cold",
    reply:
      "For a common cold, drink warm water, take steam inhalation, and use saline nasal drops. Simple cold medicines can give short‑term relief, but avoid self‑medication for more than 3 days. If you develop chest pain, shortness of breath, or high fever, consult a doctor.",
  },
  {
    key: "cough",
    label: "Cough",
    reply:
      "For simple dry cough, warm fluids and honey (if you do not have diabetes) can help. Avoid very cold drinks and smoking. If the cough lasts more than 2 weeks, you cough blood, or you feel breathless or chest‑tightness, you must consult a doctor.",
  },
  {
    key: "headache",
    label: "Headache",
    reply:
      "Many headaches are related to stress, eye strain, or dehydration. Try rest, drinking water, and reducing screen time. You may take paracetamol if you are not allergic and your doctor allows. If headache is sudden and very severe, with blurred vision, weakness, or confusion, go to emergency care.",
  },
  {
    key: "stomach",
    label: "Stomach pain",
    reply:
      "For mild stomach pain or gas, eat light food, avoid spicy and oily meals, and drink water. Simple antacids may help if you have acidity. If the pain is severe, one‑sided, associated with vomiting, blood in stool, or high fever, please see a doctor immediately.",
  },
  {
    key: "diarrhea",
    label: "Loose motion",
    reply:
      "In diarrhea, the most important treatment is fluids and ORS to prevent dehydration. Avoid heavy or spicy food; eat light food like rice, toast or bananas. If there is blood in stool, high fever, very severe weakness, or diarrhea for more than 2 days, consult a doctor.",
  },
];

function detectCondition(text) {
  const msg = text.toLowerCase();
  for (const cond of CONDITIONS) {
    if (msg.includes(cond.key)) return cond;
  }
  return null;
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I am your demo health assistant. I can give basic information for simple problems like fever, common cold, cough, headache, stomach pain, and loose motion.",
    },
    {
      from: "bot",
      text: "Type your symptom in English (for example: \"I have fever\") or tap a button below. This is only a demo, not a real medical diagnosis.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sendBotReplyForCondition = (cond) => {
    const botMsg = {
      from: "bot",
      text: `${cond.label}:\n\n${cond.reply}`,
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleConditionClick = (cond) => {
    const userMsg = { from: "user", text: cond.label };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setTimeout(() => {
      sendBotReplyForCondition(cond);
      setSending(false);
    }, 300);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    const cond = detectCondition(trimmed);
    setSending(true);

    setTimeout(() => {
      if (cond) {
        sendBotReplyForCondition(cond);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text:
              "I could not clearly match your message to a simple condition.\n\nThis demo bot only understands: fever, common cold, cough, headache, stomach pain, and loose motion.\n\nFor any serious or new symptom, please talk to a real doctor.",
          },
        ]);
      }
      setSending(false);
    }, 350);

    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 80,
        width: 340,
        maxWidth: "90vw",
        height: 440,
        background: "white",
        borderRadius: 18,
        boxShadow: "0 18px 40px rgba(15,23,42,0.45)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#0f66d1,#1d4ed8)",
          color: "white",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Health Assistant (Demo)
          </div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>...</div>
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "10px 10px 6px",
          overflowY: "auto",
          background: "#f9fafb",
          fontSize: 12,
        }}
      >
        {messages.map((m, idx) => {
          const fromUser = m.from === "user";
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: fromUser ? "flex-end" : "flex-start",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "6px 9px",
                  borderRadius: 12,
                  whiteSpace: "pre-wrap",
                  background: fromUser
                    ? "linear-gradient(90deg,#0f66d1,#1d4ed8)"
                    : "white",
                  color: fromUser ? "white" : "#111827",
                  border: fromUser ? "none" : "1px solid #e5e7eb",
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Condition buttons */}
      <div
        style={{
          padding: "6px 8px 4px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          background: "#f9fafb",
        }}
      >
        {CONDITIONS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => handleConditionClick(c)}
            style={{
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #0f66d1",
              background: "white",
              color: "#0f66d1",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          padding: "6px 8px 8px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 6,
          background: "white",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your symptom in English..."
          style={{
            flex: 1,
            borderRadius: 999,
            border: "1px solid #d1d5db",
            padding: "7px 10px",
            fontSize: 12,
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            padding: "7px 14px",
            borderRadius: 999,
            border: "none",
            background: sending
              ? "#9ca3af"
              : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
            color: "white",
            fontSize: 12,
            cursor: sending || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default function FloatingHealthChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat panel */}
      {open && <ChatPanel onClose={() => setOpen(false)} />}

      {/* Floating launcher button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg,#0f66d1,#1d4ed8)",
          color: "white",
          boxShadow: "0 12px 30px rgba(15,23,42,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {/* chhota “chat” icon style */}
        <span style={{ fontSize: 22, fontWeight: 700 }}>💬</span>
      </button>
    </>
  );
}