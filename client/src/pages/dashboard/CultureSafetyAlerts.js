import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import {
  FaShieldAlt,
  FaExclamationCircle,
  FaAmbulance,
  FaFire,
  FaInfoCircle,
  FaBell,
  FaGlobe,
  FaExclamationTriangle,
  FaRoad,
  FaBolt,
  FaMapMarkerAlt,
  FaClock,
  FaTshirt,
  FaHands,
  FaTags,
  FaUtensils,
  FaCamera,
  FaMoneyBillWave,
  FaShareAlt,
  FaCheckCircle,
} from "react-icons/fa";

// ── Data ─────────────────────────────────────────────────────────────────────

const mockAlerts = [
  {
    id: 1,
    type: "safety",
    severity: "high",
    title: "Pickpocket Alert",
    description:
      "High pickpocket activity reported near the central market area. Keep your belongings secure and avoid displaying valuables.",
    location: "Central Market, Old City",
    time: "15 min ago",
    icon: <FaExclamationTriangle />,
  },
  {
    id: 2,
    type: "safety",
    severity: "medium",
    title: "Road Closure",
    description:
      "Main highway closed due to local festival procession. Expect heavy traffic diversions on alternate routes.",
    location: "MG Road",
    time: "1 hr ago",
    icon: <FaRoad />,
  },
  {
    id: 3,
    type: "safety",
    severity: "low",
    title: "Weather Warning",
    description:
      "Thunderstorms expected after 6 PM. Carry an umbrella and avoid open areas or tall structures during the storm.",
    location: "City Wide",
    time: "2 hr ago",
    icon: <FaBolt />,
  },
];

const cultureTips = [
  {
    id: 1,
    title: "Dress Code",
    tip: "Cover shoulders and knees when visiting temples and religious sites. Scarves are available at entrances.",
    icon: <FaTshirt />,
    iconColor: "#8b5cf6",
    iconBg: "#f3f0ff",
    category: "Religious Sites",
  },
  {
    id: 2,
    title: "Greeting Customs",
    tip: 'Use "Namaste" with folded hands as a respectful greeting. Avoid public displays of affection.',
    icon: <FaHands />,
    iconColor: "#ec4899",
    iconBg: "#fdf2f8",
    category: "Social Etiquette",
  },
  {
    id: 3,
    title: "Bargaining",
    tip: "Bargaining is expected at local markets. Start at 50% of the asking price and negotiate politely.",
    icon: <FaTags />,
    iconColor: "#3b82f6",
    iconBg: "#eff6ff",
    category: "Shopping",
  },
  {
    id: 4,
    title: "Food & Water",
    tip: "Drink only bottled or filtered water. Street food is delicious but choose busy stalls with high turnover.",
    icon: <FaUtensils />,
    iconColor: "#10b981",
    iconBg: "#ecfdf5",
    category: "Health",
  },
  {
    id: 5,
    title: "Photography",
    tip: "Always ask permission before photographing locals, especially women and religious ceremonies.",
    icon: <FaCamera />,
    iconColor: "#f59e0b",
    iconBg: "#fffbeb",
    category: "Respect",
  },
  {
    id: 6,
    title: "Tipping",
    tip: "Tipping 10% at restaurants is appreciated. Round up taxi fares. Always tip hotel staff.",
    icon: <FaMoneyBillWave />,
    iconColor: "#ef4444",
    iconBg: "#fef2f2",
    category: "Money",
  },
];

const emergencyContacts = [
  { label: "Police", number: "100", icon: <FaShieldAlt />, color: "#3b82f6", bg: "#eff6ff" },
  { label: "Ambulance", number: "108", icon: <FaAmbulance />, color: "#ef4444", bg: "#fef2f2" },
  { label: "Fire", number: "101", icon: <FaFire />, color: "#f97316", bg: "#fff7ed" },
  { label: "Tourist Helpline", number: "1363", icon: <FaInfoCircle />, color: "#8b5cf6", bg: "#f5f3ff" },
];

const severityConfig = {
  high: {
    bg: "#fef2f2",
    border: "#fca5a5",
    leftBorder: "#ef4444",
    badge: "#ef4444",
    badgeBg: "#fee2e2",
    text: "HIGH",
    iconColor: "#ef4444",
  },
  medium: {
    bg: "#fffbeb",
    border: "#fcd34d",
    leftBorder: "#f59e0b",
    badge: "#f59e0b",
    badgeBg: "#fef3c7",
    text: "MEDIUM",
    iconColor: "#f59e0b",
  },
  low: {
    bg: "#f0fdf4",
    border: "#86efac",
    leftBorder: "#22c55e",
    badge: "#22c55e",
    badgeBg: "#dcfce7",
    text: "LOW",
    iconColor: "#22c55e",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CultureSafetyAlerts() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
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

  return (
    <Box
      sx={{
        maxWidth: 860,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: 3,
        fontFamily: "'Poppins', 'Roboto', sans-serif",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                fontSize: 16,
                color: "white",
              }}
            >
              <FaShieldAlt />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "1.3rem", md: "1.55rem" },
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.3px",
              }}
            >
              Safety & Culture Hub
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: 13,
              color: "#64748b",
              fontWeight: 500,
              mt: 0.5,
              pl: "50px",
            }}
          >
            Hyper-local alerts & cultural insights for smart travel
          </Typography>
        </Box>

        {/* LIVE badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            background: "#dcfce7",
            color: "#16a34a",
            fontSize: 11,
            fontWeight: 700,
            px: 1.5,
            py: 0.5,
            borderRadius: "20px",
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#16a34a",
              animation: "livePulse 1.5s ease-in-out infinite",
              "@keyframes livePulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.4 },
              },
            }}
          />
          LIVE
        </Box>
      </Box>

      {/* ── SOS + Emergency Contacts ────────────────────────────────────────── */}
      <Box
        sx={{
          background: "white",
          borderRadius: "14px",
          border: "1.5px solid #e2e8f0",
          p: 3,
          mb: 2.5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* SOS Button */}
        {sosActive ? (
          <Box
            sx={{
              background: "#fef2f2",
              border: "1.5px solid #fca5a5",
              borderRadius: "12px",
              p: 2.5,
              textAlign: "center",
              mb: 2.5,
              position: "relative",
              overflow: "hidden",
              animation: "sosFlash 1s ease-in-out infinite",
              "@keyframes sosFlash": {
                "0%, 100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.0)" },
                "50%": { boxShadow: "0 0 0 8px rgba(239,68,68,0.08)" },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 0.75,
              }}
            >
              <Box sx={{ color: "#ef4444", fontSize: 18, animation: "spin 1s linear infinite", "@keyframes spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } } }}>
                <FaBell />
              </Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#ef4444" }}>
                SOS ACTIVATED
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: "#b91c1c", mb: 2 }}>
              {sosCountdown > 0
                ? `Alerting emergency contacts in ${sosCountdown}s...`
                : "✅ Emergency contacts notified! Help is on the way."}
            </Typography>
            <Box
              onClick={() => setSosActive(false)}
              sx={{
                display: "inline-block",
                px: 2.5,
                py: 0.75,
                background: "white",
                border: "1.5px solid #fca5a5",
                color: "#ef4444",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                "&:hover": { background: "#fef2f2" },
              }}
            >
              Cancel SOS
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Box
              onMouseDown={() => setSosHolding(true)}
              onMouseUp={() => setSosHolding(false)}
              onMouseLeave={() => setSosHolding(false)}
              onTouchStart={() => setSosHolding(true)}
              onTouchEnd={() => setSosHolding(false)}
              sx={{
                position: "relative",
                width: 90,
                height: 90,
                cursor: "pointer",
                userSelect: "none",
                mb: 1,
              }}
            >
              {/* Progress ring */}
              <svg
                width="90"
                height="90"
                style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
              >
                <circle cx="45" cy="45" r="40" fill="none" stroke="#fee2e2" strokeWidth="5" />
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - holdProgress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.1s" }}
                />
              </svg>
              <Box
                sx={{
                  position: "absolute",
                  inset: 6,
                  borderRadius: "50%",
                  background: sosHolding
                    ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: sosHolding
                    ? "0 8px 24px rgba(239,68,68,0.5)"
                    : "0 4px 16px rgba(239,68,68,0.35)",
                  transform: sosHolding ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.1s ease",
                }}
              >
                <Box sx={{ color: "white", fontSize: 22, mb: 0.25 }}>
                  <FaExclamationCircle />
                </Box>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: "white", letterSpacing: 1.5 }}>
                  SOS
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
              Hold for 3 seconds to activate
            </Typography>
          </Box>
        )}

        {/* Emergency Contacts Grid */}
        <Grid container spacing={1.5}>
          {emergencyContacts.map((c) => (
            <Grid item xs={6} sm={3} key={c.label}>
              <Box
                component="a"
                href={`tel:${c.number}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: "12px",
                  border: `1.5px solid ${c.color}30`,
                  background: c.bg,
                  textDecoration: "none",
                  gap: 0.5,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 16px ${c.color}20`,
                    borderColor: `${c.color}60`,
                  },
                }}
              >
                <Box sx={{ fontSize: 20, color: c.color, mb: 0.25 }}>
                  {c.icon}
                </Box>
                <Typography sx={{ fontSize: 10, color: "#64748b", fontWeight: 700, textAlign: "center" }}>
                  {c.label}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: c.color }}>
                  {c.number}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {[
          { key: "alerts", label: "Nearby Alerts", icon: <FaBell />, count: mockAlerts.length },
          { key: "culture", label: "Culture Tips", icon: <FaGlobe /> },
        ].map((tab) => (
          <Box
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              py: 1.25,
              px: 2,
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              border: "1.5px solid",
              transition: "all 0.15s ease",
              borderColor: activeTab === tab.key ? "transparent" : "#e2e8f0",
              background: activeTab === tab.key ? "#0f172a" : "white",
              color: activeTab === tab.key ? "white" : "#64748b",
              boxShadow: activeTab === tab.key ? "0 4px 12px rgba(15,23,42,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
              "&:hover": {
                background: activeTab === tab.key ? "#0f172a" : "#f8fafc",
              },
            }}
          >
            <Box sx={{ fontSize: 14 }}>{tab.icon}</Box>
            {tab.label}
            {tab.count && (
              <Box
                sx={{
                  background: activeTab === tab.key ? "#ef4444" : "#fee2e2",
                  color: activeTab === tab.key ? "white" : "#ef4444",
                  fontSize: 10,
                  fontWeight: 800,
                  px: 0.75,
                  py: 0.1,
                  borderRadius: "10px",
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {tab.count}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* ── Alerts Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "alerts" && (
        <Box>
          {/* Filter pills */}
          <Box sx={{ display: "flex", gap: 0.75, mb: 2, flexWrap: "wrap" }}>
            {["all", "high", "medium", "low"].map((f) => (
              <Box
                key={f}
                onClick={() => setFilter(f)}
                sx={{
                  px: 1.75,
                  py: 0.4,
                  borderRadius: "20px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1.5px solid",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                  borderColor: filter === f ? "transparent" : "#e2e8f0",
                  background: filter === f ? "#0f172a" : "white",
                  color: filter === f ? "white" : "#64748b",
                  "&:hover": {
                    borderColor: filter === f ? "transparent" : "#3b82f6",
                    color: filter === f ? "white" : "#3b82f6",
                  },
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Box>
            ))}
          </Box>

          {/* Alert Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filteredAlerts.map((alert) => {
              const cfg = severityConfig[alert.severity];
              return (
                <Box
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  sx={{
                    background: "white",
                    border: "1.5px solid #e2e8f0",
                    borderLeft: `4px solid ${cfg.leftBorder}`,
                    borderRadius: "12px",
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      transform: "translateX(3px)",
                      boxShadow: `0 4px 16px ${cfg.leftBorder}15`,
                      borderColor: cfg.border,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "10px",
                        background: cfg.badgeBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        color: cfg.leftBorder,
                        flexShrink: 0,
                      }}
                    >
                      {alert.icon}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                          {alert.title}
                        </Typography>
                        <Box
                          sx={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "white",
                            background: cfg.badge,
                            px: 0.9,
                            py: 0.25,
                            borderRadius: "6px",
                            letterSpacing: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          {cfg.text}
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#475569",
                          lineHeight: 1.55,
                          mb: 0.75,
                        }}
                      >
                        {alert.description}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, fontSize: 11, color: "#94a3b8" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <FaMapMarkerAlt />
                          {alert.location}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <FaClock />
                          {alert.time}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {filteredAlerts.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <Box sx={{ fontSize: 32, color: "#cbd5e1", mb: 1 }}>
                  <FaBell />
                </Box>
                <Typography sx={{ fontWeight: 700, color: "#475569", fontSize: 14 }}>
                  No alerts found
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
                  No {filter} severity alerts in your area
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* ── Culture Tips Tab ───────────────────────────────────────────────── */}
      {activeTab === "culture" && (
        <Grid container spacing={2}>
          {cultureTips.map((tip) => (
            <Grid item xs={12} sm={6} key={tip.id}>
              <Box
                sx={{
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  p: 2.5,
                  height: "100%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    borderColor: `${tip.iconColor}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: tip.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: tip.iconColor,
                    mb: 1.5,
                  }}
                >
                  {tip.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: tip.iconColor,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    mb: 0.5,
                  }}
                >
                  {tip.category}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#0f172a", mb: 0.75 }}>
                  {tip.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>
                  {tip.tip}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Alert Detail Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={250}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            border: "1.5px solid #e2e8f0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            p: 0.5,
          },
        }}
      >
        {selectedAlert && (() => {
          const cfg = severityConfig[selectedAlert.severity];
          return (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: cfg.badgeBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: cfg.leftBorder,
                      flexShrink: 0,
                    }}
                  >
                    {selectedAlert.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>
                      {selectedAlert.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "white",
                        background: cfg.badge,
                        px: 1,
                        py: 0.25,
                        borderRadius: "6px",
                        letterSpacing: 0.5,
                        mt: 0.25,
                      }}
                    >
                      {cfg.text} SEVERITY
                    </Box>
                  </Box>
                  <Box
                    onClick={() => setSelectedAlert(null)}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "8px",
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#64748b",
                      "&:hover": { background: "#e2e8f0" },
                    }}
                  >
                    ✕
                  </Box>
                </Box>
              </DialogTitle>

              <DialogContent>
                <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.65, mb: 2 }}>
                  {selectedAlert.description}
                </Typography>

                <Box
                  sx={{
                    background: "#f8fafc",
                    border: "1.5px solid #f1f5f9",
                    borderRadius: "10px",
                    p: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.75,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      <FaMapMarkerAlt /> Location
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                      {selectedAlert.location}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 0.75,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      <FaClock /> Reported
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                      {selectedAlert.time}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                  startIcon={<FaShareAlt />}
                  sx={{
                    flex: 1,
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: 13,
                    background: "#0f172a",
                    color: "white",
                    "&:hover": { background: "#1e293b" },
                  }}
                >
                  Share Alert
                </Button>
                <Button
                  startIcon={<FaCheckCircle />}
                  onClick={() => setSelectedAlert(null)}
                  sx={{
                    flex: 1,
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: 13,
                    border: "1.5px solid #e2e8f0",
                    color: "#0f172a",
                    "&:hover": { background: "#f8fafc" },
                  }}
                >
                  Got it
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>
    </Box>
  );
}
