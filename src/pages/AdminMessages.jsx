// src/pages/AdminMessages.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminMessages() {
  const { authFetch, user } = useAuth();

  const [threads, setThreads] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  const loadThreads = async () => {
    setLoadingThreads(true);
    setError("");
    try {
      const res = await authFetch("http://localhost:5000/api/messages/threads");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load conversations");
      }
      setThreads(data);

      if (!selectedUserId && data.length > 0) {
        setSelectedUserId(data[0].userId);
        setSelectedUserInfo(data[0]);
      }
      if (data.length === 0) {
        setSelectedUserId(null);
        setSelectedUserInfo(null);
        setMessages([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load conversations");
    } finally {
      setLoadingThreads(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    if (!otherUserId) return;
    setLoadingMessages(true);
    setError("");
    try {
      const res = await authFetch(
        `http://localhost:5000/api/messages/conversation/${otherUserId}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load messages");
      }
      setMessages(data);

      await authFetch(
        `http://localhost:5000/api/messages/read/${otherUserId}`,
        {
          method: "POST",
        }
      );

      setThreads((prev) =>
        prev.map((t) =>
          t.userId === otherUserId ? { ...t, unreadCount: 0 } : t
        )
      );
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  const handleSelectThread = (thread) => {
    setSelectedUserId(thread.userId);
    setSelectedUserInfo(thread);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    setSending(true);
    setError("");

    const text = newMessage.trim();
    setNewMessage("");

    try {
      const res = await authFetch("http://localhost:5000/api/messages", {
        method: "POST",
        body: JSON.stringify({
          recipient: selectedUserId,
          text,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setMessages((prev) => [...prev, data]);

      setThreads((prev) =>
        prev.map((t) =>
          t.userId === selectedUserId
            ? {
                ...t,
                lastMessage: data.text,
                lastMessageAt: data.createdAt,
              }
            : t
        )
      );
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const selectedDisplayName = selectedUserInfo?.name || "selected user";

  const renderMessageBubble = (m, index) => {
    const currentUserId = user?.id;
    const senderId =
      typeof m.sender === "string" ? m.sender : m.sender?._id;

    const fromMe = senderId === currentUserId;

    const key = m._id || `${senderId}-${index}`;

    return (
      <div
        key={key}
        style={{
          display: "flex",
          justifyContent: fromMe ? "flex-end" : "flex-start",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            maxWidth: "75%",
            padding: "6px 9px",
            borderRadius: "12px",
            background: fromMe
              ? "linear-gradient(90deg,#0f66d1,#1d4ed8)"
              : "white",
            color: fromMe ? "white" : "#111827",
            fontSize: "12px",
            border: fromMe ? "none" : "1px solid #e5e7eb",
          }}
        >
          {m.text}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <p className="page-subtitle">
        Communicate with patients and doctors from a central inbox.
      </p>

      {error && (
        <p style={{ color: "#b91c1c", fontSize: "13px", marginBottom: "6px" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 2fr",
          gap: "14px",
          minHeight: "320px",
        }}
      >
        {/* LEFT – threads */}
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: "15px" }}>
              Conversations
            </h3>
            <button
              onClick={loadThreads}
              style={{
                fontSize: "11px",
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "4px 8px",
                background: "white",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          {loadingThreads ? (
            <p style={{ fontSize: "12px", color: "#6b7280" }}>Loading...</p>
          ) : threads.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              No conversations yet.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {threads.map((t) => (
                <li
                  key={t.userId}
                  onClick={() => handleSelectThread(t)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border:
                      selectedUserId === t.userId
                        ? "1px solid #0f66d1"
                        : "1px solid #e5e7eb",
                    marginBottom: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    background:
                      selectedUserId === t.userId ? "#eff6ff" : "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{t.name}</div>
                    <div style={{ color: "#6b7280" }}>{t.role}</div>
                    <div
                      style={{
                        color: "#9ca3af",
                        fontSize: "11px",
                        marginTop: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      {t.lastMessage}
                    </div>
                  </div>
                  {t.unreadCount > 0 && (
                    <span
                      style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 999,
                        background: "#0f766e",
                        color: "white",
                        fontSize: "11px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {t.unreadCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT – chat */}
        <div className="section">
          {!selectedUserId ? (
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              Select a conversation from the left to start chatting.
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "15px",
                    }}
                  >
                    Chat with {selectedDisplayName}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    {selectedUserInfo?.role} · {selectedUserInfo?.email}
                  </p>
                </div>
              </div>

              <div
                style={{
                  height: "220px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  fontSize: "12px",
                  marginBottom: "8px",
                  overflowY: "auto",
                  background: "#f9fafb",
                }}
              >
                {loadingMessages ? (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    No messages yet in this conversation. Start a chat.
                  </p>
                ) : (
                  messages.map((m, i) => renderMessageBubble(m, i))
                )}
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedDisplayName}...`}
                  style={{
                    flex: 1,
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    padding: "8px 10px",
                    fontSize: "12px",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !selectedUserId}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: "none",
                    background: sending
                      ? "#9ca3af"
                      : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                    color: "white",
                    fontSize: "12px",
                    cursor: sending ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}