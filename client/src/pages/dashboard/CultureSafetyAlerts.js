import { useState, useEffect } from "react";

const mockAlerts = [
  {
    id: 1,
    type: "safety",
    severity: "high",
    title: "Pickpocket Alert",
    description:
      "High pickpocket activity reported near the central market area. Keep your belongings secure.",
    location: "Central Market, Old City",
    time: "15 min ago",
    icon: "⚠️",
  },
  {
    id: 2,
    type: "safety",
    severity: "medium",
    title: "Road Closure",
    description:
      "Main highway closed due to local festival procession. Expect heavy traffic diversions.",
    location: "MG Road",
    time: "1 hr ago",
    icon: "🚧",
  },
  {
    id: 3,
    type: "safety",
    severity: "low",
    title: "Weather Warning",
    description:
      "Thunderstorms expected after 6 PM. Carry an umbrella and avoid open areas.",
    location: "City Wide",
    time: "2 hr ago",
    icon: "🌩️",
  },
];

const cultureTips = [
  {
    id: 1,
    title: "Dress Code",
    tip: "Cover shoulders and knees when visiting temples and religious sites. Scarves are available at entrances.",
    icon: "👘",
    category: "Religious Sites",
  },
  {
    id: 2,
    title: "Greeting Customs",
    tip: 'Use "Namaste" with folded hands as a respectful greeting. Avoid public displays of affection.',
    icon: "🙏",
    category: "Social Etiquette",
  },
  {
    id: 3,
    title: "Bargaining",
    tip: "Bargaining is expected at local markets. Start at 50% of the asking price and negotiate politely.",
    icon: "🛍️",
    category: "Shopping",
  },
  {
    id: 4,
    title: "Food & Water",
    tip: "Drink only bottled or filtered water. Street food is delicious but choose busy stalls with high turnover.",
    icon: "🍜",
    category: "Health",
  },
  {
    id: 5,
    title: "Photography",
    tip: "Always ask permission before photographing locals, especially women and religious ceremonies.",
    icon: "📸",
    category: "Respect",
  },
  {
    id: 6,
    title: "Tipping",
    tip: "Tipping 10% at restaurants is appreciated. Round up taxi fares. Always tip hotel staff.",
    icon: "💵",
    category: "Money",
  },
];

const emergencyContacts = [
  { label: "Police", number: "100", icon: "👮", color: "#3b82f6" },
  { label: "Ambulance", number: "108", icon: "🚑", color: "#ef4444" },
  { label: "Fire", number: "101", icon: "🚒", color: "#f97316" },
  { label: "Tourist Helpline", number: "1363", icon: "ℹ️", color: "#8b5cf6" },
];

const severityConfig = {
  high: { bg: "#fef2f2", border: "#fca5a5", badge: "#ef4444", text: "HIGH" },
  medium: {
    bg: "#fffbeb",
    border: "#fcd34d",
    badge: "#f59e0b",
    text: "MEDIUM",
  },
  low: { bg: "#f0fdf4", border: "#86efac", badge: "#22c55e", text: "LOW" },
};

export default function CultureSafetyAlerts() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sosHolding, setSosHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (sosHolding) {
      interval = setInterval(() => {
        setHoldProgress((p) => {
          if (p >= 100) {
            setSosActive(true);
            setSosHolding(false);
            clearInterval(interval);
            return 100;
          }
          return p + 5;
        });
      }, 150);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [sosHolding]);

  useEffect(() => {
    let timer;
    if (sosActive) {
      setSosCountdown(5);
      timer = setInterval(() => {
        setSosCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sosActive]);

  const filteredAlerts =
    filter === "all"
      ? mockAlerts
      : mockAlerts.filter((a) => a.severity === filter);

  const openAlert = (alert) => {
    setSelectedAlert(alert);
    setShowPopup(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>🛡️ Safety & Culture Hub</h1>
          <p style={styles.headerSub}>
            Hyper-local alerts & cultural insights for smart travel
          </p>
        </div>
        <div style={styles.liveIndicator}>
          <span style={styles.liveDot} />
          LIVE
        </div>
      </div>

      {/* SOS Button */}
      <div style={styles.sosWrapper}>
        {sosActive ? (
          <div style={styles.sosActiveBox}>
            <div style={styles.sosPulse} />
            <p style={styles.sosActiveTitle}>🚨 SOS ACTIVATED</p>
            <p style={styles.sosActiveText}>
              {sosCountdown > 0
                ? `Alerting emergency contacts in ${sosCountdown}s...`
                : "Emergency contacts notified! Help is on the way."}
            </p>
            <button
              style={styles.cancelSos}
              onClick={() => setSosActive(false)}
            >
              Cancel SOS
            </button>
          </div>
        ) : (
          <div style={styles.sosButtonWrapper}>
            <button
              style={{
                ...styles.sosButton,
                background: sosHolding
                  ? `conic-gradient(#ef4444 ${holdProgress * 3.6}deg, #fee2e2 0deg)`
                  : "#ef4444",
                transform: sosHolding ? "scale(1.05)" : "scale(1)",
              }}
              onMouseDown={() => setSosHolding(true)}
              onMouseUp={() => setSosHolding(false)}
              onMouseLeave={() => setSosHolding(false)}
              onTouchStart={() => setSosHolding(true)}
              onTouchEnd={() => setSosHolding(false)}
            >
              <span style={styles.sosIcon}>🆘</span>
              <span style={styles.sosLabel}>SOS</span>
            </button>
            <p style={styles.sosHint}>Hold for 3 seconds to activate</p>
          </div>
        )}

        {/* Emergency contacts */}
        <div style={styles.emergencyGrid}>
          {emergencyContacts.map((c) => (
            <a
              key={c.label}
              href={`tel:${c.number}`}
              style={{ ...styles.emergencyCard, borderColor: c.color }}
            >
              <span style={styles.emergencyIcon}>{c.icon}</span>
              <span style={styles.emergencyLabel}>{c.label}</span>
              <span style={{ ...styles.emergencyNumber, color: c.color }}>
                {c.number}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["alerts", "culture"].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "alerts" ? "⚠️ Nearby Alerts" : "🌏 Culture Tips"}
            {tab === "alerts" && (
              <span style={styles.badge}>{mockAlerts.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div>
          {/* Filter buttons */}
          <div style={styles.filterRow}>
            {["all", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                style={{
                  ...styles.filterBtn,
                  ...(filter === f ? styles.activeFilter : {}),
                }}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Alert cards */}
          <div style={styles.alertList}>
            {filteredAlerts.map((alert) => {
              const cfg = severityConfig[alert.severity];
              return (
                <div
                  key={alert.id}
                  style={{
                    ...styles.alertCard,
                    background: cfg.bg,
                    borderColor: cfg.border,
                  }}
                  onClick={() => openAlert(alert)}
                >
                  <div style={styles.alertTop}>
                    <span style={styles.alertEmoji}>{alert.icon}</span>
                    <div style={styles.alertInfo}>
                      <div style={styles.alertTitleRow}>
                        <span style={styles.alertTitle}>{alert.title}</span>
                        <span
                          style={{
                            ...styles.severityBadge,
                            background: cfg.badge,
                          }}
                        >
                          {cfg.text}
                        </span>
                      </div>
                      <p style={styles.alertDesc}>{alert.description}</p>
                      <div style={styles.alertMeta}>
                        <span>📍 {alert.location}</span>
                        <span>🕐 {alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Culture Tips Tab */}
      {activeTab === "culture" && (
        <div style={styles.cultureGrid}>
          {cultureTips.map((tip) => (
            <div key={tip.id} style={styles.cultureCard}>
              <div style={styles.cultureIcon}>{tip.icon}</div>
              <span style={styles.cultureCat}>{tip.category}</span>
              <h3 style={styles.cultureTitle}>{tip.title}</h3>
              <p style={styles.cultureTip}>{tip.tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Alert Popup */}
      {showPopup && selectedAlert && (
        <div style={styles.overlay} onClick={() => setShowPopup(false)}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div style={styles.popupHeader}>
              <span style={styles.popupEmoji}>{selectedAlert.icon}</span>
              <h2 style={styles.popupTitle}>{selectedAlert.title}</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowPopup(false)}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                ...styles.popupSeverity,
                background: severityConfig[selectedAlert.severity].badge,
              }}
            >
              {severityConfig[selectedAlert.severity].text} SEVERITY
            </div>
            <p style={styles.popupDesc}>{selectedAlert.description}</p>
            <div style={styles.popupMeta}>
              <div style={styles.popupMetaItem}>
                <span style={styles.popupMetaLabel}>📍 Location</span>
                <span style={styles.popupMetaValue}>
                  {selectedAlert.location}
                </span>
              </div>
              <div style={styles.popupMetaItem}>
                <span style={styles.popupMetaLabel}>🕐 Reported</span>
                <span style={styles.popupMetaValue}>{selectedAlert.time}</span>
              </div>
            </div>
            <div style={styles.popupActions}>
              <button style={styles.popupBtn}>📤 Share Alert</button>
              <button
                style={styles.popupBtnOutline}
                onClick={() => setShowPopup(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Nunito', sans-serif",
    maxWidth: 700,
    margin: "0 auto",
    padding: "24px 16px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  headerSub: {
    fontSize: 13,
    color: "#64748b",
    margin: "4px 0 0",
  },
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 20,
    letterSpacing: 1,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#16a34a",
    animation: "pulse 1.5s infinite",
  },
  sosWrapper: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  sosButtonWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  sosButton: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
    transition: "transform 0.1s",
    userSelect: "none",
  },
  sosIcon: { fontSize: 28 },
  sosLabel: { fontSize: 13, fontWeight: 800, color: "white", letterSpacing: 1 },
  sosHint: { fontSize: 11, color: "#94a3b8", marginTop: 8 },
  sosActiveBox: {
    background: "#fef2f2",
    border: "2px solid #fca5a5",
    borderRadius: 12,
    padding: 16,
    textAlign: "center",
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  sosPulse: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(239,68,68,0.05)",
    animation: "pulse 1s infinite",
    pointerEvents: "none",
  },
  sosActiveTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#ef4444",
    margin: "0 0 4px",
  },
  sosActiveText: { fontSize: 13, color: "#b91c1c", margin: "0 0 12px" },
  cancelSos: {
    background: "white",
    border: "1px solid #fca5a5",
    color: "#ef4444",
    padding: "6px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },
  emergencyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  emergencyCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 6px",
    borderRadius: 10,
    border: "1.5px solid",
    background: "white",
    textDecoration: "none",
    gap: 2,
    cursor: "pointer",
    transition: "transform 0.1s",
  },
  emergencyIcon: { fontSize: 20 },
  emergencyLabel: { fontSize: 10, color: "#64748b", fontWeight: 600 },
  emergencyNumber: { fontSize: 13, fontWeight: 800 },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: "10px 16px",
    border: "none",
    borderRadius: 10,
    background: "white",
    color: "#64748b",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  activeTab: {
    background: "#0f172a",
    color: "white",
  },
  badge: {
    background: "#ef4444",
    color: "white",
    fontSize: 11,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 10,
  },
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    padding: "5px 14px",
    borderRadius: 20,
    border: "1.5px solid #e2e8f0",
    background: "white",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  activeFilter: {
    background: "#0f172a",
    color: "white",
    borderColor: "#0f172a",
  },
  alertList: { display: "flex", flexDirection: "column", gap: 10 },
  alertCard: {
    borderRadius: 12,
    border: "1.5px solid",
    padding: 14,
    cursor: "pointer",
    transition: "transform 0.1s",
  },
  alertTop: { display: "flex", gap: 12 },
  alertEmoji: { fontSize: 28, flexShrink: 0 },
  alertInfo: { flex: 1 },
  alertTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  alertTitle: { fontWeight: 700, fontSize: 15, color: "#0f172a" },
  severityBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: "white",
    padding: "2px 7px",
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  alertDesc: {
    fontSize: 13,
    color: "#475569",
    margin: "0 0 6px",
    lineHeight: 1.5,
  },
  alertMeta: { display: "flex", gap: 12, fontSize: 11, color: "#94a3b8" },
  cultureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  cultureCard: {
    background: "white",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cultureIcon: { fontSize: 28, marginBottom: 6 },
  cultureCat: {
    fontSize: 10,
    fontWeight: 700,
    color: "#8b5cf6",
    textTransform: "uppercase",
    letterSpacing: 1,
    display: "block",
    marginBottom: 4,
  },
  cultureTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px",
  },
  cultureTip: { fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  popup: {
    background: "white",
    borderRadius: 18,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  popupHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  popupEmoji: { fontSize: 32 },
  popupTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  closeBtn: {
    background: "#f1f5f9",
    border: "none",
    borderRadius: 8,
    width: 30,
    height: 30,
    cursor: "pointer",
    fontSize: 14,
    color: "#64748b",
  },
  popupSeverity: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    color: "white",
    padding: "3px 10px",
    borderRadius: 6,
    letterSpacing: 1,
    marginBottom: 12,
  },
  popupDesc: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  popupMeta: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  popupMetaItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
  },
  popupMetaLabel: { fontSize: 12, color: "#94a3b8" },
  popupMetaValue: { fontSize: 12, fontWeight: 600, color: "#0f172a" },
  popupActions: { display: "flex", gap: 10 },
  popupBtn: {
    flex: 1,
    padding: "10px",
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  popupBtnOutline: {
    flex: 1,
    padding: "10px",
    background: "white",
    color: "#0f172a",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
};
