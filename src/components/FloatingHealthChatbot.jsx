// src/components/FloatingHealthChatbot.jsx
import { useState } from "react";

const CONDITIONS = [
  // ... same as your array
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
        right: 12,
        bottom: 76,
        width: 340,
        maxWidth: "92vw",
        height: 440,
        maxHeight: "70vh",
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
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            Basic symptom guidance only
          </div>
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
      {open && <ChatPanel onClose={() => setOpen(false)} />}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 12,
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
        <span style={{ fontSize: 22, fontWeight: 700 }}>💬</span>
      </button>
    </>
  );
}