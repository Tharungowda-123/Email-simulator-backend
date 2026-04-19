import { useMemo, useState } from "react";
import "./App.css";
import {
  createUser,
  getChat,
  getLogs,
  getSimulationChats,
  getUserStats,
  sendChatMessage,
} from "./api";

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <div className="field-label">{label}</div>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <label className="field">
      <div className="field-label">{label}</div>
      <textarea
        className="input textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
}

function Button({ children, onClick, disabled, variant = "primary", type = "button" }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function Card({ title, subtitle, children, right }) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle ? <div className="card-subtitle">{subtitle}</div> : null}
        </div>
        <div className="card-right">{right}</div>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

function ErrorBanner({ error, onClear }) {
  if (!error) return null;
  return (
    <div className="banner banner-error" role="alert">
      <div className="banner-text">{error}</div>
      <button className="banner-x" onClick={onClear} aria-label="Dismiss error">
        ✕
      </button>
    </div>
  );
}

function SuccessBanner({ message, onClear }) {
  if (!message) return null;
  return (
    <div className="banner banner-success" role="status">
      <div className="banner-text">{message}</div>
      <button className="banner-x" onClick={onClear} aria-label="Dismiss message">
        ✕
      </button>
    </div>
  );
}

function Tabs({ value, onChange, tabs }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`tab ${value === t.id ? "tab-active" : ""}`}
          onClick={() => onChange(t.id)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function MessageList({ messages }) {
  if (!messages?.length) return <div className="muted">No messages yet.</div>;
  return (
    <div className="messages">
      {messages.map((m) => (
        <div key={m._id ?? `${m.from}-${m.to}-${m.timestamp}`} className="message">
          <div className="message-top">
            <div className="message-fromto">
              <Pill>{m.sender ?? m.from}</Pill> <span className="muted">→</span>{" "}
              <Pill>{m.receiver ?? m.to}</Pill>
            </div>
            <div className="message-time">
              {m.timestamp ? new Date(m.timestamp).toLocaleString() : ""}
            </div>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            id: <code>{m._id ?? "-"}</code> • sender: <code>{m.sender ?? m.from ?? "-"}</code> •
            receiver: <code>{m.receiver ?? m.to ?? "-"}</code>
          </div>
          <div className="message-text">{m.message}</div>
        </div>
      ))}
    </div>
  );
}

function LogList({ logs }) {
  if (!logs?.length) return <div className="muted">No logs yet.</div>;
  return (
    <div className="messages">
      {logs.map((l) => (
        <div key={l._id ?? `${l.sender}-${l.receiver}-${l.timestamp}`} className="message">
          <div className="message-top">
            <div className="message-fromto">
              <Pill>{l.sender}</Pill> <span className="muted">→</span> <Pill>{l.receiver}</Pill>
            </div>
            <div className="message-time">
              {l.timestamp ? new Date(l.timestamp).toLocaleString() : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("users");

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const clearBanners = () => {
    setError("");
    setOk("");
  };

  const tabs = useMemo(
    () => [
      { id: "users", label: "Users" },
      { id: "chat", label: "Chat" },
      { id: "logs", label: "Logs" },
      { id: "simulate", label: "Simulate" },
    ],
    []
  );

  // Users
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [usersBusy, setUsersBusy] = useState(false);

  // Chat
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const [withEmail, setWithEmail] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatBusy, setChatBusy] = useState(false);

  // Simulation
  const [emailsFilter, setEmailsFilter] = useState("");
  const [simBusy, setSimBusy] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Logs (server)
  const [logBusy, setLogBusy] = useState(false);
  const [logs, setLogs] = useState([]);

  async function onCreateUser(e) {
    e.preventDefault();
    clearBanners();
    setUsersBusy(true);
    try {
      const user = await createUser({ email, username });
      setCreatedUser(user);
      setUserId(user?._id ?? "");
      setOk("User created.");
    } catch (err) {
      setError(err?.message ?? "Failed to create user.");
    } finally {
      setUsersBusy(false);
    }
  }

  async function onGetUserStats(e) {
    e.preventDefault();
    clearBanners();
    setUsersBusy(true);
    try {
      const stats = await getUserStats(userId);
      setUserStats(stats);
      setOk("User loaded.");
    } catch (err) {
      setError(err?.message ?? "Failed to load user.");
    } finally {
      setUsersBusy(false);
    }
  }

  async function onSendMessage(e) {
    e.preventDefault();
    clearBanners();
    setChatBusy(true);
    try {
      await sendChatMessage({ from, to, message });
      setOk("Message sent.");
      setMessage("");
    } catch (err) {
      setError(err?.message ?? "Failed to send message.");
    } finally {
      setChatBusy(false);
    }
  }

  async function onLoadServerLogs() {
    clearBanners();
    setLogBusy(true);
    try {
      const res = await getLogs();
      const normalized = Array.isArray(res)
        ? res.map((l) => ({
            _id: l._id,
            sender: l.sender,
            receiver: l.receiver,
            timestamp: l.timestamp,
            source: "server",
          }))
        : [];
      setLogs(normalized);
      setOk("Logs loaded from server.");
    } catch (err) {
      setError(err?.message ?? "Failed to load logs.");
    } finally {
      setLogBusy(false);
    }
  }

  async function onLoadChat(e) {
    e.preventDefault();
    clearBanners();
    setChatBusy(true);
    try {
      const msgs = await getChat({ email: chatEmail, withEmail });
      const normalized = Array.isArray(msgs)
        ? msgs.map((m) => ({
            ...m,
            sender: m.sender ?? m.from,
            receiver: m.receiver ?? m.to,
          }))
        : [];
      setChatMessages(normalized);
      setOk("Chat loaded.");
    } catch (err) {
      setError(err?.message ?? "Failed to load chat.");
    } finally {
      setChatBusy(false);
    }
  }

  async function onSimulate(e) {
    e.preventDefault();
    clearBanners();
    setSimBusy(true);
    try {
      const emails = emailsFilter
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await getSimulationChats({ emails });
      const normalizedChats = Array.isArray(res?.chats)
        ? res.chats.map((c) => ({
            ...c,
            sender: c.sender ?? c.from,
            receiver: c.receiver ?? c.to,
          }))
        : [];
      setSimResult({ ...(res ?? {}), chats: normalizedChats });
      setOk("Simulation history loaded.");
    } catch (err) {
      setError(err?.message ?? "Failed to load simulation history.");
    } finally {
      setSimBusy(false);
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="title">Globo Email Simulator</div>
          <div className="subtitle">React frontend wired to your Express API on port 5000.</div>
        </div>
        <div className="topbar-right">
          <Pill>API: /api</Pill>
        </div>
      </div>

      <ErrorBanner error={error} onClear={() => setError("")} />
      <SuccessBanner message={ok} onClear={() => setOk("")} />

      <Tabs
        value={tab}
        onChange={(t) => {
          clearBanners();
          setTab(t);
        }}
        tabs={tabs}
      />

      {tab === "users" ? (
        <div className="grid">
          <Card
            title="Create user"
            subtitle="POST /api/users"
            right={<Pill>MongoDB required</Pill>}
          >
            <form className="form" onSubmit={onCreateUser}>
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="a@gmail.com"
                type="email"
              />
              <Field
                label="Username"
                value={username}
                onChange={setUsername}
                placeholder="Alice"
              />
              <div className="row">
                <Button type="submit" disabled={usersBusy}>
                  Create
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEmail("");
                    setUsername("");
                  }}
                  disabled={usersBusy}
                >
                  Clear
                </Button>
              </div>
            </form>

            {createdUser ? (
              <pre className="pre">{JSON.stringify(createdUser, null, 2)}</pre>
            ) : null}
          </Card>

          <Card title="Get user stats" subtitle="GET /api/users/:id">
            <form className="form" onSubmit={onGetUserStats}>
              <Field
                label="User ID"
                value={userId}
                onChange={setUserId}
                placeholder="Paste Mongo _id"
              />
              <div className="row">
                <Button type="submit" disabled={usersBusy || !userId}>
                  Load
                </Button>
              </div>
            </form>
            {userStats ? <pre className="pre">{JSON.stringify(userStats, null, 2)}</pre> : null}
          </Card>
        </div>
      ) : null}

      {tab === "chat" ? (
        <div className="grid">
          <Card title="Send message" subtitle="POST /api/chat/send">
            <form className="form" onSubmit={onSendMessage}>
              <div className="two">
                <Field label="From" value={from} onChange={setFrom} placeholder="a@gmail.com" />
                <Field label="To" value={to} onChange={setTo} placeholder="b@gmail.com" />
              </div>
              <TextArea
                label="Message"
                value={message}
                onChange={setMessage}
                placeholder="Hello!"
              />
              <div className="row">
                <Button type="submit" disabled={chatBusy}>
                  Send
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Chat history" subtitle="GET /api/chat?email=...&with=...">
            <form className="form" onSubmit={onLoadChat}>
              <div className="two">
                <Field
                  label="Email"
                  value={chatEmail}
                  onChange={setChatEmail}
                  placeholder="a@gmail.com"
                />
                <Field
                  label="With (optional)"
                  value={withEmail}
                  onChange={setWithEmail}
                  placeholder="b@gmail.com"
                />
              </div>
              <div className="row">
                <Button type="submit" disabled={chatBusy || !chatEmail}>
                  Load chat
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setChatMessages([]);
                  }}
                  disabled={chatBusy}
                >
                  Clear list
                </Button>
              </div>
            </form>
            <MessageList messages={chatMessages} />
          </Card>
        </div>
      ) : null}

      {tab === "logs" ? (
        <div className="grid">
          <Card
            title="Logs"
            subtitle="Stores sender/receiver/timestamp"
            right={<Pill>Source: server</Pill>}
          >
            <div className="row">
              <Button variant="primary" onClick={onLoadServerLogs} disabled={logBusy}>
                Load server logs
              </Button>
            </div>
            <div className="spacer" />
            <div className="muted">
              Logs come from <code>GET /api/logs</code> (Mongo: <code>EmailLog</code>).
            </div>
            <LogList logs={logs} />
          </Card>
        </div>
      ) : null}

      {tab === "simulate" ? (
        <div className="grid">
          <Card title="Simulate (chat history)" subtitle="POST /api/simulate">
            <form className="form" onSubmit={onSimulate}>
              <Field
                label="Emails filter (optional)"
                value={emailsFilter}
                onChange={setEmailsFilter}
                placeholder="a@gmail.com,b@gmail.com"
              />
              <div className="row">
                <Button type="submit" disabled={simBusy}>
                  Load history
                </Button>
              </div>
            </form>

            <div className="muted">
              Returns only real manual chat messages saved via <code>/api/chat/send</code>.
            </div>

            {simResult ? (
              <>
                <div className="spacer" />
                <div className="muted">
                  {Array.isArray(simResult?.chats) ? simResult.chats.length : 0} messages
                </div>
                <MessageList messages={simResult?.chats ?? []} />
              </>
            ) : null}
          </Card>
        </div>
      ) : null}

      <div className="footer">
        Tip: start backend with <code>npm start</code> (root) and frontend with{" "}
        <code>npm start</code> (frontend).
      </div>
    </div>
  );
}
