# Okta Demo Platform — SE Identity Flow Explorer

Visual companion tool for Okta SE demos. Displays live identity flows, app access, and auth events across three use cases.

## Setup (one time)

```bash
npm install
```

## Run

```bash
npm run dev
```

This starts **both** the API server (port 3001) and the Vite dev server (port 5173) simultaneously.

Open the URL shown in your terminal — in Codespace, forward **port 5173** and open the forwarded URL.

## Configure

On first load, a config modal appears. Either:
- **Demo Mode** — click "Demo Mode" for mock data, no Okta needed
- **Live Mode** — enter your Okta domain (e.g. `dev-12345.okta.com`) and an API token

To get an API token: Okta Admin → Security → API → Tokens → Create Token

## Use Cases

| Tab | What it shows |
|-----|--------------|
| 🏢 Centralized Identity | User profile with attribute sources (AD/HRIS/Okta), lifecycle events, identity flow diagram |
| ⚡ Workforce Agility | App assignments, group memberships, snapshot diff for Joiner/Mover/Leaver demos |
| 🔐 End-User Security | Auth events with risk scores, policy evaluations, device/IP signals |
| 📜 System Log | Full searchable/filterable event log |

## File Structure

```
okta-demo-platform/
├── server.js          ← Express API proxy (port 3001)
├── vite.config.js     ← Vite config + /api proxy
├── index.html         ← Vite entry point
├── package.json
└── src/
    ├── main.jsx       ← React entry
    └── App.jsx        ← Full application
```
