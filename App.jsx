import { useState, useEffect } from "react";

// ─── Global styles ────────────────────────────────────────────────────────────
const globalStyle = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%);
    min-height: 100vh;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; opacity: 0.5; }
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id:"u1", status:"ACTIVE", profile:{firstName:"Rick",lastName:"Sanchez",email:"rick.sanchez@demo.com",login:"rick.sanchez@demo.com",department:"Sales",title:"Account Executive",mobilePhone:"+1-555-0101",city:"Calgary",employeeNumber:"EMP-001",manager:"john.doe@demo.com"}, credentials:{provider:{type:"ACTIVE_DIRECTORY",name:"AD Connector"}} },
  { id:"u2", status:"ACTIVE", profile:{firstName:"Sally",lastName:"Ride",email:"sally.ride@demo.com",login:"sally.ride@demo.com",department:"Engineering",title:"Software Engineer",mobilePhone:"+1-555-0102",city:"San Francisco",employeeNumber:"EMP-002"}, credentials:{provider:{type:"ACTIVE_DIRECTORY",name:"AD Connector"}} },
  { id:"u3", status:"ACTIVE", profile:{firstName:"Mary",lastName:"Shelley",email:"mary.shelley@demo.com",login:"mary.shelley@demo.com",department:"Marketing",title:"Marketing Manager",mobilePhone:"+1-555-0103",city:"Toronto",employeeNumber:"EMP-003"}, credentials:{provider:{type:"OKTA",name:"Okta"}} },
  { id:"u4", status:"ACTIVE", profile:{firstName:"Marta",lastName:"Peri",email:"marta.peri@demo.com",login:"marta.peri@demo.com",department:"Finance",title:"Financial Analyst",mobilePhone:"+1-555-0104",city:"Barcelona",employeeNumber:"EMP-004"}, credentials:{provider:{type:"OKTA",name:"Okta"}} },
  { id:"u5", status:"ACTIVE", profile:{firstName:"Rafael",lastName:"Green",email:"rafa.green@demo.com",login:"rafa.green@demo.com",department:"IT",title:"IT Engineer",mobilePhone:"+1-555-0105",city:"Montreal",employeeNumber:"EMP-005"}, credentials:{provider:{type:"ACTIVE_DIRECTORY",name:"AD Connector"}} },
];

const APP_LOGOS = {
  aws:       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/320px-Amazon_Web_Services_Logo.svg.png",
  salesforce:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/320px-Salesforce.com_logo.svg.png",
  slack:     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/200px-Slack_icon_2019.svg.png",
  google:    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/200px-Google_%22G%22_logo.svg.png",
  github:    "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  docusign:  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/DocuSign_logo.svg/320px-DocuSign_logo.svg.png",
  monday:    "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/monday-logo-x2.png",
  zoom:      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Zoom_Logo_2022.svg/320px-Zoom_Logo_2022.svg.png",
};

function getAppLogo(label = "", logoUrl = "") {
  if (logoUrl) return logoUrl;
  const l = label.toLowerCase();
  for (const [k, v] of Object.entries(APP_LOGOS)) if (l.includes(k)) return v;
  return null;
}

const MOCK_APP_LINKS = {
  u1:[{appName:"amazon_aws",label:"AWS (Admin)",logoUrl:APP_LOGOS.aws,appInstanceId:"app1"},{appName:"salesforce",label:"Salesforce",logoUrl:APP_LOGOS.salesforce,appInstanceId:"app2"},{appName:"docusign",label:"DocuSign",logoUrl:APP_LOGOS.docusign,appInstanceId:"app6"}],
  u2:[{appName:"github",label:"GitHub",logoUrl:APP_LOGOS.github,appInstanceId:"app3"},{appName:"slack",label:"Slack",logoUrl:APP_LOGOS.slack,appInstanceId:"app4"},{appName:"amazon_aws",label:"AWS (Dev)",logoUrl:APP_LOGOS.aws,appInstanceId:"app1b"}],
  u3:[{appName:"monday",label:"Monday.com",logoUrl:APP_LOGOS.monday,appInstanceId:"app5"},{appName:"docusign",label:"DocuSign",logoUrl:APP_LOGOS.docusign,appInstanceId:"app6"},{appName:"zoom",label:"Zoom",logoUrl:APP_LOGOS.zoom,appInstanceId:"app7"}],
  u4:[{appName:"zoom",label:"Zoom",logoUrl:APP_LOGOS.zoom,appInstanceId:"app7"},{appName:"docusign",label:"DocuSign",logoUrl:APP_LOGOS.docusign,appInstanceId:"app6"}],
  u5:[{appName:"amazon_aws",label:"AWS (Admin)",logoUrl:APP_LOGOS.aws,appInstanceId:"app1"},{appName:"github",label:"GitHub",logoUrl:APP_LOGOS.github,appInstanceId:"app3"},{appName:"slack",label:"Slack",logoUrl:APP_LOGOS.slack,appInstanceId:"app4"}],
};

const MOCK_GROUPS = {
  u1:[{id:"g1",type:"OKTA_GROUP",profile:{name:"Sales Team"}},{id:"g10",type:"OKTA_GROUP",profile:{name:"Everyone"}},{id:"g11",type:"APP_GROUP",profile:{name:"Salesforce – Standard User"}}],
  u2:[{id:"g3",type:"OKTA_GROUP",profile:{name:"Engineering"}},{id:"g10",type:"OKTA_GROUP",profile:{name:"Everyone"}},{id:"g12",type:"APP_GROUP",profile:{name:"AWS – Developer"}}],
  u3:[{id:"g4",type:"OKTA_GROUP",profile:{name:"Marketing"}},{id:"g10",type:"OKTA_GROUP",profile:{name:"Everyone"}}],
  u4:[{id:"g5",type:"OKTA_GROUP",profile:{name:"Finance"}},{id:"g10",type:"OKTA_GROUP",profile:{name:"Everyone"}}],
  u5:[{id:"g6",type:"OKTA_GROUP",profile:{name:"IT"}},{id:"g10",type:"OKTA_GROUP",profile:{name:"Everyone"}},{id:"g13",type:"APP_GROUP",profile:{name:"AWS – Admin"}}],
};

function makeMockLogs(userId) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return [];
  const n = `${user.profile.firstName} ${user.profile.lastName}`;
  const now = new Date();
  return [
    { uuid:"l1", published:new Date(now-120e3).toISOString(),   eventType:"user.session.start",                         displayMessage:`User ${n} logged in`,              severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:n},             client:{ipAddress:"192.168.1.10", userAgent:{browser:"CHROME",os:"Windows 10"}, geographicalContext:{city:"Calgary",country:"Canada"}},    debugContext:{debugData:{behaviors:"POSITIVE_OKTA_BROWSER_FINGERPRINT",risk:"LOW"}} },
    { uuid:"l2", published:new Date(now-900e3).toISOString(),   eventType:"policy.evaluate_sign_on",                    displayMessage:"Sign-on policy – 1FA allowed",     severity:"INFO", outcome:{result:"ALLOW"},     actor:{displayName:n},             client:{ipAddress:"192.168.1.10", userAgent:{browser:"CHROME",os:"Windows 10"}, geographicalContext:{city:"Calgary",country:"Canada"}},    debugContext:{debugData:{risk:"LOW",behaviors:"POSITIVE_OKTA_BROWSER_FINGERPRINT"}} },
    { uuid:"l3", published:new Date(now-1800e3).toISOString(),  eventType:"user.authentication.sso",                   displayMessage:`${n} SSO to Salesforce`,           severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:n},             client:{ipAddress:"192.168.1.10"},                                                                                          debugContext:{debugData:{}} },
    { uuid:"l4", published:new Date(now-3600e3).toISOString(),  eventType:"policy.evaluate_sign_on",                    displayMessage:"Sign-on policy – MFA required",    severity:"WARN", outcome:{result:"CHALLENGE"}, actor:{displayName:n},             client:{ipAddress:"201.45.12.88", userAgent:{browser:"FIREFOX",os:"Windows 10"}, geographicalContext:{city:"Toronto",country:"Canada"}},    debugContext:{debugData:{risk:"MEDIUM",behaviors:"NEGATIVE_NEW_DEVICE"}} },
    { uuid:"l5", published:new Date(now-3700e3).toISOString(),  eventType:"user.authentication.auth_via_mfa",           displayMessage:"User authenticated with OTP",      severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:n},             client:{ipAddress:"201.45.12.88"},                                                                                          debugContext:{debugData:{}} },
    { uuid:"l6", published:new Date(now-86400e3).toISOString(), eventType:"application.provision.user.push_new_account",displayMessage:`Push new account for ${n} to AWS`, severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:"Okta System"}, client:{},                                                                                                                 debugContext:{debugData:{}} },
    { uuid:"l7", published:new Date(now-86500e3).toISOString(), eventType:"group.user_membership.add",                  displayMessage:`${n} added to Sales Team`,         severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:"Okta Admin"},  client:{},                                                                                                                 debugContext:{debugData:{}} },
    { uuid:"l8", published:new Date(now-172800e3).toISOString(),eventType:"user.lifecycle.create",                      displayMessage:`User account created: ${n}`,       severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:"Okta AD Agent"},client:{},                                                                                                                debugContext:{debugData:{}} },
    { uuid:"l9", published:new Date(now-172900e3).toISOString(),eventType:"directory.user.sync",                        displayMessage:"User synced from Active Directory", severity:"INFO", outcome:{result:"SUCCESS"},   actor:{displayName:"Okta AD Agent"},client:{},                                                                                                                debugContext:{debugData:{}} },
  ];
}

// ─── API helpers (all relative — Vite proxies to Express) ─────────────────────
const q = (obj) => new URLSearchParams(Object.fromEntries(Object.entries(obj).filter(([,v]) => v != null && v !== ""))).toString();

const api = {
  testConnection: (domain, token) =>
    fetch("/api/test-connection", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({domain,token}) }).then(r => r.json()),
  users: (domain, token, search = "") =>
    fetch(`/api/users?${q({domain,token,q:search,limit:200})}`).then(r => r.json()),
  user: (domain, token, id) =>
    fetch(`/api/users/${id}?${q({domain,token})}`).then(r => r.json()),
  appLinks: (domain, token, id) =>
    fetch(`/api/users/${id}/appLinks?${q({domain,token})}`).then(r => r.json()),
  groups: (domain, token, id) =>
    fetch(`/api/users/${id}/groups?${q({domain,token})}`).then(r => r.json()),
  logs: (domain, token, userId) =>
    fetch(`/api/logs?${q({domain,token,userId,limit:200})}`).then(r => r.json()),
};

// ─── Design tokens & primitives ───────────────────────────────────────────────
const C = {
  SUCCESS:"#10b981", FAILURE:"#ef4444", ALLOW:"#10b981", DENY:"#ef4444",
  CHALLENGE:"#f59e0b", SKIPPED:"#9ca3af",
  INFO:"#6366f1", WARN:"#f59e0b", ERROR:"#ef4444", DEBUG:"#9ca3af",
};

const fmtDate = iso => iso ? new Date(iso).toLocaleString() : "—";

function Badge({ text, color = "#6366f1" }) {
  return (
    <span style={{
      background: color + "20", color, border: `1px solid ${color}44`,
      display:"inline-flex", alignItems:"center", padding:"1px 7px",
      borderRadius:999, fontSize:10, fontWeight:600, whiteSpace:"nowrap",
    }}>{text}</span>
  );
}

function Spinner({ size = 20 }) {
  return (
    <div style={{
      width:size, height:size, flexShrink:0,
      border:`2px solid #e5e7eb`, borderTop:`2px solid #6366f1`,
      borderRadius:"50%", animation:"spin 0.7s linear infinite",
    }}/>
  );
}

function Card({ title, icon, children, style = {} }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", padding:20, boxShadow:"0 1px 4px rgba(0,0,0,.05)", ...style }}>
      {title && (
        <div style={{ fontSize:11, fontWeight:700, color:"#374151", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
          <span>{icon}</span>{title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Flow diagram primitives ──────────────────────────────────────────────────
function FlowNode({ icon, label, sublabel, color = "#1e3a5f", outline = false, highlight = false, small = false }) {
  const size = small ? 40 : 52;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth: small ? 48 : 64 }}>
      <div
        style={{
          width:size, height:size, borderRadius:"50%",
          background: outline ? "#fff" : color,
          color: outline ? color : "#fff",
          border: highlight ? "3px solid #6366f1" : outline ? `2px solid ${color}` : "none",
          boxShadow: highlight ? "0 0 0 4px #6366f122" : "0 2px 8px rgba(0,0,0,.12)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: small ? 16 : 22, transition:"transform .15s", userSelect:"none",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >{icon}</div>
      {label    && <span style={{ fontSize:10, fontWeight:600, color:"#374151", textAlign:"center", maxWidth:72, lineHeight:1.2 }}>{label}</span>}
      {sublabel && <span style={{ fontSize:9,  color:"#6366f1",  textAlign:"center", maxWidth:72, lineHeight:1.2 }}>{sublabel}</span>}
    </div>
  );
}

function Connector({ color = "#1e3a5f" }) {
  return <div style={{ flex:1, height:2, background:color, alignSelf:"center", marginBottom:24, minWidth:20 }}/>;
}

function FlowRow({ children }) {
  return <div style={{ display:"flex", alignItems:"flex-end", overflowX:"auto", paddingBottom:8 }}>{children}</div>;
}

function FlowLegend({ items }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:14, marginTop:10, fontSize:10, color:"#9ca3af" }}>
      {items.map(([color, label]) => (
        <span key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:color, display:"inline-block" }}/>
          {label}
        </span>
      ))}
    </div>
  );
}

// ─── UC1 — Centralized Identity ───────────────────────────────────────────────
function UC1({ user, logs, loading }) {
  const p    = user?.profile || {};
  const pr   = user?.credentials?.provider;
  const isAD = pr?.type?.includes("ACTIVE");
  const dept = p.department || "—";

  const attrs = [
    { label:"First Name",  value:p.firstName,    source: isAD ? "Active Directory" : "Okta" },
    { label:"Last Name",   value:p.lastName,     source: isAD ? "Active Directory" : "Okta" },
    { label:"Email",       value:p.email,        source: isAD ? "Active Directory" : "Okta" },
    { label:"Login",       value:p.login,        source: "Okta" },
    { label:"Department",  value:p.department,   source: isAD ? "Active Directory" : "HRIS" },
    { label:"Job Title",   value:p.title,        source: isAD ? "Active Directory" : "HRIS" },
    { label:"Mobile",      value:p.mobilePhone,  source: "HRIS" },
    { label:"City",        value:p.city,         source: isAD ? "Active Directory" : "Okta" },
    { label:"Employee #",  value:p.employeeNumber,source:"HRIS" },
    { label:"Manager",     value:p.manager,      source: "HRIS" },
  ].filter(a => a.value);

  const srcColor = s => s.includes("Active") ? "#3b82f6" : s === "HRIS" ? "#f59e0b" : s === "Okta" ? "#10b981" : "#8b5cf6";

  const lcLogs = (logs || []).filter(l =>
    ["user.lifecycle.create","directory.user.sync","user.import.saved_account",
     "user.lifecycle.activate","user.account.update_profile","group.user_membership.add"].includes(l.eventType)
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Flow diagram */}
      <Card>
        <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".1em", marginBottom:16 }}>
          Identity Flow — Centralized Directory
        </div>
        <FlowRow>
          <FlowNode icon="🏢" label="HR System"          sublabel="Deel / HRIS"           color={isAD ? "#d1fae5" : "#10b981"} outline={isAD} />
          <Connector />
          <FlowNode icon="🖥" label="Active Directory"   sublabel="On-Prem"              color={isAD ? "#1d4ed8" : "#d1d5db"} outline={!isAD} highlight={isAD} />
          <Connector color={isAD ? "#1d4ed8" : "#9ca3af"} />
          <FlowNode icon="🔄" label="Import & Sync"      sublabel="Okta AD Agent"         color="#f59e0b" outline />
          <Connector color="#f59e0b" />
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <FlowNode icon="🗄" label="Universal Directory" sublabel="Single Source of Truth" color="#4f46e5" highlight />
            <div style={{ background:"#eef2ff", color:"#4338ca", fontSize:9, fontWeight:600, padding:"2px 8px", borderRadius:6, marginBottom:20 }}>
              dept: {dept} → Group Rules
            </div>
          </div>
          <Connector color="#4f46e5" />
          <FlowNode icon="⚡" label="Auto-Provisioning"  sublabel="700+ Integrations"     color="#4f46e5" outline />
          <Connector />
          <div style={{ display:"flex", flexDirection:"column", gap:6, paddingBottom:20 }}>
            <FlowNode icon="☁️" label="SaaS Apps"        color="#1e3a5f" small />
            <FlowNode icon="🔐" label="PAM / Servers"    color="#6d28d9" small />
          </div>
        </FlowRow>
        <FlowLegend items={[["#10b981","HR/HRIS"],["#1d4ed8","Active Directory"],["#4f46e5","Universal Directory"],["#f59e0b","Integration"]]} />
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* User profile */}
        <Card title="User Profile & Attribute Sources" icon="👤">
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, paddingBottom:14, borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#4f46e5", fontWeight:700, fontSize:16, flexShrink:0 }}>
              {p.firstName?.[0]}{p.lastName?.[0]}
            </div>
            <div>
              <div style={{ fontWeight:700, color:"#111827" }}>{p.firstName} {p.lastName}</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>{p.email}</div>
              <div style={{ display:"flex", gap:6, marginTop:4 }}>
                <Badge text={user?.status || "—"} color={user?.status === "ACTIVE" ? "#10b981" : "#ef4444"} />
                <Badge text={pr?.name || pr?.type || "Okta"} color={isAD ? "#3b82f6" : "#10b981"} />
              </div>
            </div>
          </div>
          <table style={{ width:"100%", fontSize:11, borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ color:"#9ca3af", fontSize:9, textTransform:"uppercase" }}>
                <th style={{ textAlign:"left", paddingBottom:6 }}>Attribute</th>
                <th style={{ textAlign:"left", paddingBottom:6 }}>Value</th>
                <th style={{ textAlign:"left", paddingBottom:6 }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {attrs.map((a, i) => (
                <tr key={i} style={{ borderTop:"1px solid #f9fafb" }}>
                  <td style={{ padding:"4px 8px 4px 0", color:"#6b7280", whiteSpace:"nowrap" }}>{a.label}</td>
                  <td style={{ padding:"4px 8px 4px 0", fontFamily:"monospace", color:"#1f2937", fontSize:10 }}>{a.value}</td>
                  <td style={{ padding:"4px 0" }}><Badge text={a.source} color={srcColor(a.source)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Lifecycle events */}
        <Card title="Identity Lifecycle Events" icon="📋">
          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner /></div>
            : lcLogs.length === 0
              ? <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:32 }}>No lifecycle events found</div>
              : <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:320, overflowY:"auto" }}>
                  {lcLogs.map((l, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"6px 8px", borderRadius:8, background: i%2===0?"#f9fafb":"#fff", fontSize:11 }}>
                      <span style={{ color:"#9ca3af", whiteSpace:"nowrap", fontFamily:"monospace", fontSize:10 }}>{fmtDate(l.published)}</span>
                      <Badge text={l.outcome?.result || "INFO"} color={C[l.outcome?.result] || "#6366f1"} />
                      <span style={{ color:"#374151" }}>{l.displayMessage || l.eventType}</span>
                    </div>
                  ))}
                </div>
          }
        </Card>
      </div>
    </div>
  );
}

// ─── UC2 — Workforce Agility ──────────────────────────────────────────────────
function AppPill({ al, badge }) {
  const logo = getAppLogo(al.label || "", al.logoUrl || "");
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:10, border:"1px solid #e5e7eb", background:"#fafafa", marginBottom:4 }}>
      <div style={{ width:28, height:28, borderRadius:8, background:"#fff", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
        {logo
          ? <img src={logo} alt="" style={{ width:20, height:20, objectFit:"contain" }} onError={e => e.target.style.display = "none"} />
          : <span style={{ fontSize:14 }}>📦</span>
        }
      </div>
      <span style={{ fontSize:12, fontWeight:600, color:"#1f2937", flex:1 }}>{al.label || al.appName}</span>
      {badge && <Badge text={badge.text} color={badge.color} />}
    </div>
  );
}

function UC2({ user, appLinks, groups, logs, loading, prevApps, setPrevApps }) {
  const [snapshotLabel, setSnapshotLabel] = useState("");
  const [showGap,       setShowGap]       = useState(false);

  const dept = user?.profile?.department || "—";

  const curSet = new Set((appLinks || []).map(a => a.appInstanceId || a.label));
  const prvSet = new Set((prevApps  || []).map(a => a.appInstanceId || a.label));
  const added     = (appLinks || []).filter(a => !prvSet.has(a.appInstanceId || a.label));
  const removed   = (prevApps  || []).filter(a => !curSet.has(a.appInstanceId || a.label));
  const unchanged = (appLinks || []).filter(a =>  prvSet.has(a.appInstanceId || a.label));

  const provLogs = (logs || []).filter(l =>
    ["application.user_membership.add","application.user_membership.remove",
     "application.provision.user.push_new_account","application.provision.user.deactivate",
     "group.user_membership.add","group.user_membership.remove",
     "user.lifecycle.deactivate","user.lifecycle.activate"].includes(l.eventType)
  );

  const appGroups   = (groups || []).filter(g => g.type === "APP_GROUP");
  const otherGroups = (groups || []).filter(g => g.type !== "APP_GROUP");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Flow */}
      <Card>
        <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".1em", marginBottom:16 }}>
          Workforce Agility — Joiner / Mover / Leaver
        </div>
        <FlowRow>
          <FlowNode icon="👤" label="Onboarding / Offboarding"          color="#1e3a5f" highlight />
          <Connector />
          <FlowNode icon="🔄" label="Workflows & Triggers"               color="#f59e0b" outline />
          <Connector color="#f59e0b" />
          <FlowNode icon="📋" label="Group Rules" sublabel={`dept = ${dept}`} color="#8b5cf6" outline />
          <Connector color="#8b5cf6" />
          <FlowNode icon="🗄" label="Universal Directory"                color="#4f46e5" />
          <Connector color="#4f46e5" />
          <FlowNode icon="⚡" label="Auto-Provision / Deprovision" sublabel={`${(appLinks||[]).length} apps`} color="#10b981" highlight />
          <Connector color="#10b981" />
          <div style={{ display:"flex", flexDirection:"column", gap:5, paddingBottom:20 }}>
            {(appLinks || []).slice(0, 3).map((al, i) => {
              const logo = getAppLogo(al.label || "", al.logoUrl || "");
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, background:"#eef2ff", padding:"3px 8px", borderRadius:8, fontSize:10, fontWeight:600, color:"#3730a3" }}>
                  {logo && <img src={logo} alt="" style={{ width:14, height:14, objectFit:"contain" }} onError={e => e.target.style.display="none"} />}
                  {al.label}
                </div>
              );
            })}
            {(appLinks || []).length > 3 && <span style={{ fontSize:9, color:"#9ca3af", paddingLeft:4 }}>+{(appLinks||[]).length - 3} more</span>}
          </div>
        </FlowRow>
        <div style={{ display:"flex", gap:16, marginTop:4, fontSize:10 }}>
          <span style={{ color:"#10b981", fontWeight:600 }}>⬤ Joiner</span>
          <span style={{ color:"#3b82f6", fontWeight:600 }}>⬤ Mover</span>
          <span style={{ color:"#ef4444", fontWeight:600 }}>⬤ Leaver</span>
          <span style={{ color:"#9ca3af" }}>All flows automated via group rules & provisioning</span>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* App access + snapshot diff */}
        <Card>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", gap:6 }}>
              🔑 App Access ({(appLinks||[]).length} apps)
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button
                onClick={() => { setPrevApps([...(appLinks||[])]); setSnapshotLabel(`@ ${new Date().toLocaleTimeString()}`); setShowGap(false); }}
                style={{ fontSize:10, padding:"4px 10px", background:"#eef2ff", color:"#4338ca", border:"none", borderRadius:8, fontWeight:600 }}
              >📸 {snapshotLabel ? `Saved ${snapshotLabel}` : "Take Snapshot"}</button>
              {snapshotLabel && (
                <button
                  onClick={() => setShowGap(s => !s)}
                  style={{ fontSize:10, padding:"4px 10px", background: showGap ? "#fef3c7" : "#f3f4f6", color: showGap ? "#92400e" : "#374151", border:"none", borderRadius:8, fontWeight:600 }}
                >{showGap ? "Hide Diff" : "⚡ Show Diff"}</button>
              )}
            </div>
          </div>

          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:24 }}><Spinner /></div>
            : showGap && snapshotLabel
              ? <div style={{ maxHeight:300, overflowY:"auto" }}>
                  {added.length    > 0 && <><div style={{ fontSize:10, fontWeight:700, color:"#059669", textTransform:"uppercase", marginBottom:4 }}>✅ Added ({added.length})</div>    {added.map((al,i)    => <AppPill key={i} al={al} badge={{text:"Provisioned",color:"#059669"}}/>)}</>}
                  {removed.length  > 0 && <><div style={{ fontSize:10, fontWeight:700, color:"#dc2626", textTransform:"uppercase", margin:"10px 0 4px" }}>❌ Removed ({removed.length})</div>  {removed.map((al,i)  => <AppPill key={i} al={al} badge={{text:"Deprovisioned",color:"#dc2626"}}/>)}</>}
                  {unchanged.length> 0 && <><div style={{ fontSize:10, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", margin:"10px 0 4px" }}>— Unchanged ({unchanged.length})</div>{unchanged.map((al,i)=> <AppPill key={i} al={al}/>)}</>}
                  {added.length === 0 && removed.length === 0 && <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:16 }}>No changes detected since snapshot</div>}
                </div>
              : <div style={{ maxHeight:300, overflowY:"auto" }}>
                  {(appLinks||[]).length === 0
                    ? <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:32 }}>No apps assigned</div>
                    : (appLinks||[]).map((al,i) => <AppPill key={i} al={al} />)
                  }
                </div>
          }
        </Card>

        {/* Groups + provisioning log */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card title="Group Memberships" icon="👥">
            {loading
              ? <div style={{ display:"flex", justifyContent:"center", padding:16 }}><Spinner /></div>
              : <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {otherGroups.length > 0 && <div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>Policy / Dept Groups</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {otherGroups.map((g,i) => <span key={i} style={{ background:"#eef2ff", color:"#3730a3", padding:"2px 8px", borderRadius:999, fontSize:10, fontWeight:600 }}>{g.profile?.name}</span>)}
                    </div>
                  </div>}
                  {appGroups.length > 0 && <div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>App Groups</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {appGroups.map((g,i) => <span key={i} style={{ background:"#d1fae5", color:"#065f46", padding:"2px 8px", borderRadius:999, fontSize:10, fontWeight:600 }}>{g.profile?.name}</span>)}
                    </div>
                  </div>}
                  {(groups||[]).length === 0 && <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:12 }}>No groups found</div>}
                </div>
            }
          </Card>

          <Card title="Provisioning Events" icon="⚡" style={{ flex:1 }}>
            {loading
              ? <div style={{ display:"flex", justifyContent:"center", padding:16 }}><Spinner /></div>
              : provLogs.length === 0
                ? <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:16 }}>No provisioning events</div>
                : <div style={{ maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:3 }}>
                    {provLogs.map((l,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:6, padding:"5px 6px", borderRadius:6, background: i%2===0?"#f9fafb":"#fff", fontSize:10 }}>
                        <Badge text={l.outcome?.result || "—"} color={C[l.outcome?.result] || "#6366f1"} />
                        <span style={{ color:"#374151", flex:1 }}>{l.displayMessage || l.eventType}</span>
                        <span style={{ color:"#9ca3af", whiteSpace:"nowrap", fontSize:9 }}>{fmtDate(l.published)}</span>
                      </div>
                    ))}
                  </div>
            }
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── UC3 — End-User Security ──────────────────────────────────────────────────
function getRiskInfo(log) {
  const risk      = log.debugContext?.debugData?.risk;
  const behaviors = log.debugContext?.debugData?.behaviors || "";
  if (risk === "HIGH"   || behaviors.includes("NEGATIVE")) return { label:"HIGH",   color:"#ef4444" };
  if (risk === "LOW"    || behaviors.includes("POSITIVE")) return { label:"LOW",    color:"#10b981" };
  if (risk === "MEDIUM")                                   return { label:"MEDIUM", color:"#f59e0b" };
  return null;
}

function UC3({ user, logs, loading }) {
  const authLogs   = (logs||[]).filter(l => ["user.session.start","user.authentication.sso","user.authentication.auth_via_mfa","policy.evaluate_sign_on","user.mfa.factor.activate"].includes(l.eventType));
  const policyLogs = (logs||[]).filter(l => l.eventType === "policy.evaluate_sign_on");
  const uniqueIPs  = [...new Set((logs||[]).filter(l => l.client?.ipAddress).map(l => l.client.ipAddress))];
  const uniqueUAs  = [...new Set((logs||[]).filter(l => l.client?.userAgent?.browser).map(l => `${l.client.userAgent.browser} / ${l.client.userAgent.os}`))];
  const uniqueLocs = [...new Set((logs||[]).filter(l => l.client?.geographicalContext?.city).map(l => `${l.client.geographicalContext.city}, ${l.client.geographicalContext.country}`))];

  const authIcon = l => l.eventType.includes("mfa") ? "🔐" : l.eventType.includes("session") ? "🟢" : l.eventType.includes("policy") ? "📋" : "🔗";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card>
        <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".1em", marginBottom:16 }}>
          End-User Security — Context-Aware Authentication
        </div>
        <FlowRow>
          <FlowNode icon="🌐" label="Login Attempt"   sublabel="Any device / network"  color="#1e3a5f" />
          <Connector />
          <FlowNode icon="🔍" label="Risk Engine"     sublabel="IP · Device · Behavior" color="#f59e0b" outline />
          <Connector color="#f59e0b" />
          <FlowNode icon="📋" label="Policy Eval"     sublabel="Sign-on Policy"          color="#4f46e5" outline highlight />
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginLeft:12, paddingBottom:20 }}>
            {[["#10b981","✅","Low Risk → 1FA"],["#f59e0b","🔐","Medium → MFA / FastPass"],["#ef4444","🚫","High Risk → Deny"]].map(([c,ic,lbl]) => (
              <div key={lbl} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:20, height:2, background:c }} />
                <FlowNode icon={ic} label={lbl} color={c} small />
              </div>
            ))}
          </div>
          <Connector />
          <FlowNode icon="🔑" label="Session Granted" sublabel="Least Privilege"         color="#10b981" highlight />
          <Connector color="#10b981" />
          <FlowNode icon="📣" label="Workflow Alert"  sublabel="Slack / Ticket"           color="#8b5cf6" outline />
        </FlowRow>
        <div style={{ fontSize:10, color:"#9ca3af", marginTop:4 }}>
          💡 FastPass = NIST AAL3, phishing-resistant, device-bound · Signals: new device, new country, new IP, velocity
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Recent Authentication Events" icon="🔐">
          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:24 }}><Spinner /></div>
            : authLogs.length === 0
              ? <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:32 }}>No auth events found</div>
              : <div style={{ maxHeight:340, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
                  {authLogs.map((l, i) => {
                    const risk = getRiskInfo(l);
                    return (
                      <div key={i} style={{ border:"1px solid #f3f4f6", borderRadius:10, padding:"8px 10px", background:"#fafafa" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                          <span style={{ fontSize:16 }}>{authIcon(l)}</span>
                          <span style={{ fontSize:11, fontWeight:600, color:"#1f2937", flex:1 }}>{l.displayMessage || l.eventType}</span>
                          <Badge text={l.outcome?.result || "—"} color={C[l.outcome?.result] || "#6366f1"} />
                          {risk && <Badge text={risk.label} color={risk.color} />}
                        </div>
                        <div style={{ marginTop:4, fontSize:10, color:"#9ca3af", display:"flex", gap:10, flexWrap:"wrap" }}>
                          <span>🕐 {fmtDate(l.published)}</span>
                          {l.client?.ipAddress                  && <span>📍 {l.client.ipAddress}</span>}
                          {l.client?.userAgent?.browser         && <span>🌐 {l.client.userAgent.browser}/{l.client.userAgent.os}</span>}
                          {l.client?.geographicalContext?.city  && <span>🌍 {l.client.geographicalContext.city}, {l.client.geographicalContext.country}</span>}
                        </div>
                        {l.debugContext?.debugData?.behaviors && (
                          <div style={{ marginTop:3, fontSize:9, color:"#6366f1", fontWeight:600 }}>🧠 {l.debugContext.debugData.behaviors}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
          }
        </Card>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card title="Policy Evaluations" icon="📋">
            {loading
              ? <div style={{ display:"flex", justifyContent:"center", padding:12 }}><Spinner /></div>
              : policyLogs.length === 0
                ? <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:16 }}>No policy evaluations</div>
                : <div style={{ maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}>
                    {policyLogs.map((l, i) => {
                      const risk = getRiskInfo(l);
                      const dd   = l.debugContext?.debugData || {};
                      return (
                        <div key={i} style={{ padding:"6px 8px", borderRadius:8, background: i%2===0?"#f9fafb":"#fff", fontSize:10 }}>
                          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", marginBottom:2 }}>
                            <span style={{ color:"#9ca3af", fontFamily:"monospace", fontSize:9 }}>{fmtDate(l.published)}</span>
                            <Badge text={l.outcome?.result || "—"} color={C[l.outcome?.result] || "#6366f1"} />
                            {risk && <Badge text={`Risk: ${risk.label}`} color={risk.color} />}
                          </div>
                          <div style={{ display:"flex", gap:10, color:"#6b7280", flexWrap:"wrap", fontSize:9 }}>
                            {l.client?.ipAddress                 && <span>IP: {l.client.ipAddress}</span>}
                            {l.client?.geographicalContext?.city && <span>📍 {l.client.geographicalContext.city}</span>}
                            {dd.behaviors                        && <span style={{ color:"#6366f1" }}>🧠 {dd.behaviors}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
            }
          </Card>

          <Card title="Device & Network Signals" icon="📱" style={{ flex:1 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                ["IPs Seen",     uniqueIPs,  ip  => <span style={{ background:"#f3f4f6", color:"#374151", padding:"2px 8px", borderRadius:6, fontSize:10, fontFamily:"monospace" }}>{ip}</span>],
                ["Browsers / OS",uniqueUAs,  ua  => <span style={{ background:"#eef2ff", color:"#4338ca", padding:"2px 8px", borderRadius:6, fontSize:10 }}>{ua}</span>],
                ["Locations",    uniqueLocs, loc => <span style={{ background:"#f0fdf4", color:"#166534", padding:"2px 8px", borderRadius:6, fontSize:10 }}>🌍 {loc}</span>],
              ].map(([title, items, render]) => items.length > 0 && (
                <div key={title}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:4 }}>{title}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{items.map((x,i) => <React.Fragment key={i}>{render(x)}</React.Fragment>)}</div>
                </div>
              ))}
              {uniqueIPs.length === 0 && <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:8 }}>No device signals in logs</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── System Log ───────────────────────────────────────────────────────────────
function SystemLog({ logs, loading }) {
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const types    = [...new Set((logs||[]).map(l => l.eventType))].sort();
  const filtered = (logs||[]).filter(l =>
    (!typeFilter || l.eventType === typeFilter) &&
    (!search || JSON.stringify(l).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card>
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#374151" }}>📜 System Log</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{ flex:1, minWidth:120, fontSize:11, border:"1px solid #e5e7eb", borderRadius:8, padding:"4px 10px", outline:"none" }}
        />
        <select
          value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ fontSize:11, border:"1px solid #e5e7eb", borderRadius:8, padding:"4px 8px", maxWidth:240, outline:"none" }}
        >
          <option value="">All event types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{ fontSize:10, color:"#9ca3af" }}>{filtered.length} events</span>
      </div>

      {loading
        ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner /></div>
        : filtered.length === 0
          ? <div style={{ color:"#9ca3af", fontSize:12, textAlign:"center", padding:32 }}>No events found</div>
          : <div style={{ maxHeight:520, overflowY:"auto" }}>
              {filtered.map((l, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:6, padding:"5px 6px", borderRadius:6, background: i%2===0?"#f9fafb":"#fff", fontSize:10 }}>
                  <span style={{ color:"#9ca3af", fontFamily:"monospace", whiteSpace:"nowrap", flexShrink:0, fontSize:9 }}>{fmtDate(l.published)}</span>
                  <Badge text={l.severity || "INFO"} color={C[l.severity] || "#6366f1"} />
                  <Badge text={l.outcome?.result || "—"} color={C[l.outcome?.result] || "#9ca3af"} />
                  <span style={{ color:"#6366f1", fontFamily:"monospace", fontSize:9, whiteSpace:"nowrap", flexShrink:0 }}>{l.eventType}</span>
                  <span style={{ color:"#374151", flex:1 }}>{l.displayMessage}</span>
                  {l.client?.ipAddress && <span style={{ color:"#9ca3af", whiteSpace:"nowrap", fontSize:9, flexShrink:0 }}>{l.client.ipAddress}</span>}
                </div>
              ))}
            </div>
      }
    </Card>
  );
}

// ─── Config modal ─────────────────────────────────────────────────────────────
function ConfigModal({ onSave, initial = {} }) {
  const [domain,  setDomain]  = useState(initial.domain  || "");
  const [token,   setToken]   = useState(initial.token   || "");
  const [testing, setTesting] = useState(false);
  const [result,  setResult]  = useState(null);

  const testConnection = async () => {
    setTesting(true); setResult(null);
    try {
      const r = await api.testConnection(domain, token);
      setResult(r.ok ? { ok:true, msg:"✅ Connected!" } : { ok:false, msg:r.error || "Connection failed" });
    } catch (e) {
      setResult({ ok:false, msg:"Cannot reach the API server. Make sure `node server.js` is running." });
    }
    setTesting(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,.2)", width:"100%", maxWidth:460, padding:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <div style={{ width:44, height:44, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:"#fff", flexShrink:0 }}>🔒</div>
          <div>
            <div style={{ fontWeight:800, fontSize:18, color:"#111827" }}>Okta Demo Platform</div>
            <div style={{ fontSize:12, color:"#6b7280" }}>SE Identity Flow Explorer</div>
          </div>
        </div>

        {[
          ["Okta Domain", "yourtenant.okta.com",  "e.g. dev-12345.okta.com",                 domain, setDomain, "text"],
          ["API Token",   "SSWS 00abc…",          "Admin → Security → API → Tokens",          token,  setToken,  "password"],
        ].map(([label, ph, hint, val, setter, type]) => (
          <div key={label} style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:".05em", display:"block", marginBottom:4 }}>{label}</label>
            <input
              type={type} value={val} onChange={e => setter(e.target.value.trim())} placeholder={ph}
              style={{ width:"100%", border:"1px solid #e5e7eb", borderRadius:10, padding:"8px 12px", fontSize:13, outline:"none" }}
            />
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{hint}</div>
          </div>
        ))}

        {result && (
          <div style={{ padding:10, borderRadius:10, fontSize:12, fontWeight:600, background: result.ok ? "#d1fae5" : "#fee2e2", color: result.ok ? "#065f46" : "#991b1b", marginBottom:14 }}>
            {result.msg}
          </div>
        )}

        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={testConnection} disabled={!domain || !token || testing}
            style={{ flex:1, padding:"10px 0", border:"1px solid #c7d2fe", background:"#eef2ff", color:"#4338ca", borderRadius:10, fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
          >
            {testing && <Spinner size={14} />} {testing ? "Testing…" : "🔌 Test Connection"}
          </button>
          <button
            onClick={() => onSave({ domain, token })} disabled={!domain || !token}
            style={{ flex:1, padding:"10px 0", background:"#4f46e5", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13 }}
          >
            Save & Connect
          </button>
        </div>

        <button
          onClick={() => onSave({ domain:"DEMO", token:"DEMO" })}
          style={{ width:"100%", marginTop:12, padding:"8px 0", background:"none", border:"none", color:"#9ca3af", fontSize:12, fontWeight:600 }}
        >
          👀 Demo Mode (mock data — no Okta needed)
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const TABS = [
  { icon:"🏢", label:"Centralized Identity" },
  { icon:"⚡", label:"Workforce Agility" },
  { icon:"🔐", label:"End-User Security" },
  { icon:"📜", label:"System Log" },
];

export default function App() {
  const [config,     setConfig]     = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [tab,        setTab]        = useState(0);
  const [users,      setUsers]      = useState([]);
  const [userId,     setUserId]     = useState("");
  const [ud,         setUd]         = useState({ user:{}, appLinks:[], groups:[], logs:[] });
  const [loading,    setLoading]    = useState({ users:false, data:false });
  const [prevApps,   setPrevApps]   = useState([]);
  const [userSearch, setUserSearch] = useState("");

  const isDemo = config?.domain === "DEMO";

  // Load users when config changes
  useEffect(() => {
    if (!config) return;
    if (isDemo) { setUsers(MOCK_USERS); setUserId("u1"); return; }
    setLoading(l => ({ ...l, users:true }));
    api.users(config.domain, config.token)
      .then(data => {
        const sorted = [...(Array.isArray(data) ? data : [])].sort((a,b) =>
          (a.profile?.firstName||"").localeCompare(b.profile?.firstName||"")
        );
        setUsers(sorted);
        if (sorted[0]) setUserId(sorted[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(l => ({ ...l, users:false })));
  }, [config]);

  // Load user data when user or config changes
  useEffect(() => {
    if (!userId || !config) return;
    setPrevApps([]);
    if (isDemo) {
      setUd({ user: MOCK_USERS.find(u => u.id === userId) || {}, appLinks: MOCK_APP_LINKS[userId] || [], groups: MOCK_GROUPS[userId] || [], logs: makeMockLogs(userId) });
      return;
    }
    setLoading(l => ({ ...l, data:true }));
    Promise.all([
      api.user(config.domain, config.token, userId),
      api.appLinks(config.domain, config.token, userId),
      api.groups(config.domain, config.token, userId),
      api.logs(config.domain, config.token, userId),
    ])
      .then(([user, appLinks, groups, logs]) =>
        setUd({ user: user||{}, appLinks: Array.isArray(appLinks)?appLinks:[], groups: Array.isArray(groups)?groups:[], logs: Array.isArray(logs)?logs:[] })
      )
      .catch(() => {})
      .finally(() => setLoading(l => ({ ...l, data:false })));
  }, [userId, config]);

  if (!config) return <><style>{globalStyle}</style><ConfigModal onSave={setConfig} /></>;

  const { user, appLinks, groups, logs } = ud;
  const selectedUser   = users.find(u => u.id === userId) || user;
  const filteredUsers  = users.filter(u => {
    if (!userSearch) return true;
    const p = u.profile || {};
    return `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(userSearch.toLowerCase());
  });

  return (
    <>
      <style>{globalStyle}</style>
      {showConfig && <ConfigModal onSave={c => { setConfig(c); setShowConfig(false); }} initial={config} />}

      {/* ── Header ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", boxShadow:"0 1px 3px rgba(0,0,0,.05)", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"10px 24px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:16, flexShrink:0 }}>O</div>
          <div style={{ lineHeight:1.2 }}>
            <div style={{ fontWeight:800, color:"#111827", fontSize:14 }}>Okta Demo Platform</div>
            <div style={{ fontSize:9, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".05em" }}>SE Identity Flow Explorer</div>
          </div>
          {isDemo && <span style={{ background:"#fef3c7", color:"#92400e", border:"1px solid #fde68a", padding:"2px 8px", borderRadius:999, fontSize:9, fontWeight:700 }}>DEMO MODE</span>}
          <div style={{ flex:1 }} />
          <input
            value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Filter users…"
            style={{ fontSize:11, border:"1px solid #e5e7eb", borderRadius:8, padding:"5px 10px", width:110, outline:"none" }}
          />
          <select
            value={userId} onChange={e => setUserId(e.target.value)}
            style={{ fontSize:12, border:"1px solid #e5e7eb", borderRadius:8, padding:"5px 10px", maxWidth:220, outline:"none", background:"#fff" }}
          >
            {filteredUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.profile?.firstName} {u.profile?.lastName}{u.status !== "ACTIVE" ? ` (${u.status})` : ""}
              </option>
            ))}
          </select>
          {loading.users && <Spinner />}
          {selectedUser?.profile && (
            <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:12, borderLeft:"1px solid #e5e7eb" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#4f46e5", fontWeight:700, fontSize:12, flexShrink:0 }}>
                {selectedUser.profile.firstName?.[0]}{selectedUser.profile.lastName?.[0]}
              </div>
              <div style={{ lineHeight:1.3 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#1f2937" }}>{selectedUser.profile.firstName} {selectedUser.profile.lastName}</div>
                <div style={{ fontSize:10, color:"#9ca3af" }}>{selectedUser.profile.department || "—"}</div>
              </div>
              <Badge text={selectedUser.status} color={selectedUser.status === "ACTIVE" ? "#10b981" : "#ef4444"} />
            </div>
          )}
          <button onClick={() => setShowConfig(true)} style={{ background:"none", border:"none", fontSize:18, padding:4, borderRadius:6, color:"#9ca3af" }} title="Settings">⚙️</button>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", display:"flex" }}>
          {TABS.map((t, i) => (
            <button
              key={i} onClick={() => setTab(i)}
              style={{
                padding:"10px 18px", fontSize:12, fontWeight:600,
                border:"none", borderBottom:`2px solid ${tab===i ? "#4f46e5" : "transparent"}`,
                color: tab===i ? "#4f46e5" : "#6b7280",
                background:"none", display:"flex", alignItems:"center", gap:6,
                marginBottom:-1, transition:"color .15s",
              }}
            >{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 24px" }}>
        {loading.data && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, color:"#6366f1", fontSize:12, fontWeight:600 }}>
            <Spinner /> Loading Okta data…
          </div>
        )}
        {tab === 0 && <UC1 user={selectedUser} logs={logs} loading={loading.data} />}
        {tab === 1 && <UC2 user={selectedUser} appLinks={appLinks} groups={groups} logs={logs} loading={loading.data} prevApps={prevApps} setPrevApps={setPrevApps} />}
        {tab === 2 && <UC3 user={selectedUser} logs={logs} loading={loading.data} />}
        {tab === 3 && <SystemLog logs={logs} loading={loading.data} />}
      </div>
    </>
  );
}
