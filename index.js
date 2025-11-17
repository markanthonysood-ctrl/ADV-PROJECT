import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const auth = typeof window !== "undefined" && localStorage.getItem("authUser");
    if (!auth) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(auth));

    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const storedRegs = JSON.parse(localStorage.getItem("registrations") || "[]");
    setEvents(storedEvents);
    setRegistrations(storedRegs);
  }, [router]);

  const saveRegistrations = (next) => {
    setRegistrations(next);
    localStorage.setItem("registrations", JSON.stringify(next));
  };

  const handleRegister = (eventId) => {
    if (!user) return;
    const already = registrations.find((r) => r.eventId === eventId && r.email === user.email);
    if (already) return;
    const next = [
      ...registrations,
      // eslint-disable-next-line react-hooks/purity
      { id: Date.now(), eventId, email: user.email, name: user.name || user.email, timestamp: new Date().toISOString() },
    ];
    saveRegistrations(next);
  };

  const handleUnregister = (regId) => {
    const next = registrations.filter((r) => r.id !== regId);
    saveRegistrations(next);
  };

  const myRegistrations = registrations.filter((r) => r.email === (user?.email || ""));
  const upcomingEvents = events
    .map((e) => ({ ...e, dateObj: e.date ? new Date(e.date) : null }))
    .sort((a, b) => {
      if (!a.dateObj) return 1;
      if (!b.dateObj) return -1;
      return a.dateObj - b.dateObj;
    });

  const sidebarVisibleWidth = 220;
  const sidebarCollapsedWidth = 64;

  const sidebarStyle = {
    width: sidebarOpen ? sidebarVisibleWidth : sidebarCollapsedWidth,
    background: "#0f172a",
    color: "#e6eef8",
    minHeight: "100vh",
    padding: 18,
    boxSizing: "border-box",
    transition: "width 200ms ease",
    overflow: "hidden",
  };

  const containerStyle = {
    display: "flex",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f4f6fb",
    minHeight: "100vh",
  };

  const contentStyle = {
    flex: 1,
    padding: 28,
    transition: "margin-left 200ms ease",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 18,
    boxShadow: "0 6px 18px rgba(20,20,40,0.06)",
    marginBottom: 16,
  };

  const navItem = (label, onClick) => {
    const compact = !sidebarOpen;
    const displayLabel = compact ? label.charAt(0).toUpperCase() : label;
    return (
      <button
        title={label}
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: compact ? 0 : 8,
          width: "100%",
          textAlign: "left",
          padding: "10px 12px",
          margin: "6px 0",
          background: "transparent",
          border: "none",
          color: "#e6eef8",
          cursor: "pointer",
          borderRadius: 6,
          fontSize: 14,
        }}
      >
        <span style={{ width: 28, textAlign: "center", fontWeight: 700 }}>{displayLabel.charAt(0)}</span>
        {!compact && <span>{label}</span>}
      </button>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    router.push("/login");
  };

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              EL
            </div>
            {sidebarOpen && <div style={{ fontSize: 18, fontWeight: 700 }}>EventLog</div>}
          </div>

          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            style={{
              background: "transparent",
              border: "none",
              color: "#9fb3d6",
              cursor: "pointer",
              fontSize: 18,
              padding: 6,
            }}
          >
            {sidebarOpen ? "‹" : "›"}
          </button>
        </div>

        {sidebarOpen && (
          <div style={{ fontSize: 13, color: "#9fb3d6", marginBottom: 12 }}>
            {user ? `Hi, ${user.name || user.email}` : "Loading..."}
          </div>
        )}

        <nav style={{ marginTop: 12 }}>
          {navItem("Home", () => router.push("/dashboard"))}
          {navItem("Browse events", () => document.getElementById("events-list")?.scrollIntoView({ behavior: "smooth" }))}
          {navItem("My registrations", () => document.getElementById("my-registrations")?.scrollIntoView({ behavior: "smooth" }))}
          {navItem("Profile", () => router.push("/profile"))}
        </nav>

        <div style={{ marginTop: 20, display: "flex", justifyContent: sidebarOpen ? "stretch" : "center" }}>
          <button
            onClick={handleLogout}
            style={{
              width: sidebarOpen ? "100%" : 40,
              padding: "10px 12px",
              borderRadius: 6,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
            title="Sign out"
          >
            {sidebarOpen ? "Sign out" : "⎋"}
          </button>
        </div>
      </aside>

      <main style={contentStyle}>
        <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Add a small toggle for convenience on narrow screens */}
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "none",
                background: "#eef2ff",
                cursor: "pointer",
              }}
            >
              ☰
            </button>

            <div>
              <h2 style={{ margin: 0 }}>Welcome to EventReg</h2>
              <div style={{ color: "#64748b", marginTop: 6 }}>
                Browse upcoming events and register — your dashboard for event participation.
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Registered</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{myRegistrations.length}</div>
          </div>
        </div>

        <section id="events-list" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "8px 0 12px 0" }}>Upcoming events</h3>
          {upcomingEvents.length === 0 ? (
            <div style={cardStyle}>No events available. Check back later.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {upcomingEvents.map((ev) => {
                const isRegistered = registrations.some((r) => r.eventId === ev.id && r.email === user?.email);
                return (
                  <div key={ev.id} style={{ ...cardStyle }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{ev.title}</div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>{ev.location || "Online"}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>
                          {ev.date ? new Date(ev.date).toLocaleDateString() : "TBD"}
                        </div>
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>{ev.time || ""}</div>
                      </div>
                    </div>

                    <div style={{ color: "#475569", marginBottom: 12 }}>{ev.description || "No description."}</div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleRegister(ev.id)}
                        disabled={isRegistered}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: isRegistered ? "#94a3b8" : "#10b981",
                          color: "#fff",
                          cursor: isRegistered ? "default" : "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {isRegistered ? "Registered" : "Register"}
                      </button>

                      {isRegistered && (
                        <button
                          onClick={() => {
                            const myReg = registrations.find((r) => r.eventId === ev.id && r.email === user.email);
                            if (myReg) handleUnregister(myReg.id);
                          }}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section id="my-registrations">
          <h3 style={{ margin: "8px 0 12px 0" }}>My registrations</h3>
          <div style={cardStyle}>
            {myRegistrations.length === 0 ? (
              <div style={{ color: "#64748b" }}>You have no registrations yet.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {myRegistrations.map((r) => {
                  const ev = events.find((e) => e.id === r.eventId) || { title: "Unknown event", date: null, location: "" };
                  return (
                    <li
                      key={r.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{ev.title}</div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>
                          {ev.date ? new Date(ev.date).toLocaleDateString() : "TBD"} — {ev.location || "Online"}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, color: "#64748b" }}>{new Date(r.timestamp).toLocaleString()}</div>
                        <button
                          onClick={() => handleUnregister(r.id)}
                          style={{
                            marginTop: 8,
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "none",
                            background: "#ef4444",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}