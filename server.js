const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");

const app  = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Okta fetch helper ────────────────────────────────────────────────────────
async function okta(domain, token, endpoint, params = {}) {
  const url = new URL(`https://${domain}${endpoint}`);
  for (const [k, v] of Object.entries(params))
    if (v !== undefined && v !== null && v !== "")
      url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `SSWS ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return { data: await res.json(), status: res.status };
}

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
};

// ── Routes ───────────────────────────────────────────────────────────────────
app.post("/api/test-connection", wrap(async (req, res) => {
  const { domain, token } = req.body;
  const { data, status } = await okta(domain, token, "/api/v1/users", { limit: 1 });
  if (status === 200) return res.json({ ok: true });
  res.status(400).json({ ok: false, error: data.errorSummary || "Auth failed — check domain and token" });
}));

app.get("/api/users", wrap(async (req, res) => {
  const { domain, token, q, limit = 200 } = req.query;
  const { data } = await okta(domain, token, "/api/v1/users", { limit, q });
  res.json(Array.isArray(data) ? data : []);
}));

app.get("/api/users/:id", wrap(async (req, res) => {
  const { domain, token } = req.query;
  const { data } = await okta(domain, token, `/api/v1/users/${req.params.id}`);
  res.json(data);
}));

app.get("/api/users/:id/appLinks", wrap(async (req, res) => {
  const { domain, token } = req.query;
  const { data } = await okta(domain, token, `/api/v1/users/${req.params.id}/appLinks`);
  res.json(Array.isArray(data) ? data : []);
}));

app.get("/api/users/:id/groups", wrap(async (req, res) => {
  const { domain, token } = req.query;
  const { data } = await okta(domain, token, `/api/v1/users/${req.params.id}/groups`);
  res.json(Array.isArray(data) ? data : []);
}));

app.get("/api/logs", wrap(async (req, res) => {
  const { domain, token, userId, eventType, since, limit = 200 } = req.query;
  let filter = "";
  if (userId && eventType) filter = `actor.id eq "${userId}" and eventType eq "${eventType}"`;
  else if (userId)         filter = `actor.id eq "${userId}"`;
  else if (eventType)      filter = `eventType eq "${eventType}"`;
  const { data } = await okta(domain, token, "/api/v1/logs", {
    filter: filter || undefined, since, limit, sortOrder: "DESCENDING",
  });
  res.json(Array.isArray(data) ? data : []);
}));

app.get("/api/apps", wrap(async (req, res) => {
  const { domain, token } = req.query;
  const { data } = await okta(domain, token, "/api/v1/apps", { limit: 200 });
  res.json(Array.isArray(data) ? data : []);
}));

app.get("/api/groups", wrap(async (req, res) => {
  const { domain, token } = req.query;
  const { data } = await okta(domain, token, "/api/v1/groups", { limit: 200 });
  res.json(Array.isArray(data) ? data : []);
}));

app.listen(PORT, () =>
  console.log(`  ✅  API server → http://localhost:${PORT}`)
);
