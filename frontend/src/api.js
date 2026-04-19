async function readJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await readJson(res);
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.error || data.message)) ||
      (typeof data === "string" ? data : null) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export function createUser({ email, username }) {
  return request("/api/users", { method: "POST", body: { email, username } });
}

export function getUserStats(id) {
  return request(`/api/users/${encodeURIComponent(id)}`);
}

export function sendChatMessage({ from, to, message }) {
  return request("/api/chat/send", { method: "POST", body: { from, to, message } });
}

export function getChat({ email, withEmail }) {
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  if (withEmail) params.set("with", withEmail);
  return request(`/api/chat?${params.toString()}`);
}

export function getSimulationChats({ emails }) {
  return request("/api/simulate", {
    method: "POST",
    body: Array.isArray(emails) && emails.length ? { emails } : {},
  });
}

export function getLogs() {
  return request("/api/logs");
}

