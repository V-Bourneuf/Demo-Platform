# Okta Demo Platform — SE Identity Flow Explorer

Visual companion tool for Okta SE demos. Reads live Okta logs + API data and displays them
as interactive identity flow diagrams, per the three use cases below.

---

## Quick Start

### MacBook (local)

```bash
mkdir okta-demo-platform && cd okta-demo-platform
# Copy App.jsx into src/, server.js and package.json into root, public/index.html into public/
npm install
node server.js
# Open http://localhost:3000
```

### GitHub Codespace

```bash
npm install
node server.js
# Forward port 3000 in the Ports tab
# Use the https://xxx.github.dev forwarded URL as Backend URL in the app config
```

---

## File Structure

```
okta-demo-platform/
  server.js          ← Express proxy (RENAME server_code.txt → server.js)
  package.json
  public/
    index.html       ← React SPA (built from App.jsx)
  src/
    App.jsx          ← Full React app source
```

---

## Setup: Create public/index.html

Create `public/index.html` with this content (serves the React app from CDN):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Okta Demo Platform</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet"/>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="/App.jsx"></script>
</body>
</html>
```

> Note: Alternatively, use `create-react-app` or Vite and drop App.jsx into src/.

---

## Okta API Token

1. Log in to your Okta Admin console
2. Go to **Security → API → Tokens**
3. Click **Create Token** and copy the value
4. Paste into the app config screen

---

## Demo Use Cases

### UC1 — Centralized Identity
- Shows user profile with per-attribute source labels (AD, HRIS, Okta)
- Identity lifecycle events: create, sync, import, activate
- Visual flow: HR → AD → Okta UD → SaaS Apps

### UC2 — Workforce Agility (Joiner / Mover / Leaver)
- Shows app assignments with logos
- Group memberships (policy groups vs app groups)
- **Snapshot feature**: take a before-snapshot, make changes in Okta, refresh → see the diff (added/removed apps)
- Provisioning events log

### UC3 — End-User Security
- Authentication events with risk scores and behavioral signals
- Policy evaluations: outcome (ALLOW / CHALLENGE / DENY), risk level
- Device signals: IP addresses, browser/OS, geolocation

### System Log Tab
- Full searchable event log, filterable by event type

---

## Notes

- **Demo Mode**: Click "Demo Mode" in config to use mock data without any Okta connection
- The user dropdown lists all users from your Okta tenant
- App logos are automatically matched by app name (AWS, Salesforce, Slack, GitHub, DocuSign, etc.)
- For GitHub Codespace: use the HTTPS forwarded URL (not localhost) as the Backend URL
