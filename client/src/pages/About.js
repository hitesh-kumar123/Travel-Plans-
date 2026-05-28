import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";

const VALUES = [
  { emoji: "🌍", title: "Global Reach", desc: "We connect travellers with destinations across 180+ countries, offering curated experiences that respect local cultures and environments." },
  { emoji: "🔒", title: "Safe Travel", desc: "Every trip booked through PackGo includes 24/7 emergency support, travel insurance, and verified accommodations." },
  { emoji: "💚", title: "Sustainable Tourism", desc: "We partner with eco-conscious providers and offset carbon footprints for every booking made through our platform." },
  { emoji: "🤝", title: "Community Driven", desc: "With 40,000+ active travellers, PackGo is built on shared experiences, honest reviews, and traveller-to-traveller advice." },
];

export default function About() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      {/* Nav */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 3, md: 6 }, py: 2, borderBottom: "0.5px solid rgba(26,74,107,0.12)", background: "rgba(253,250,245,0.92)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a4a6b", textDecoration: "none" }}>Pack<span style={{ color: "#e8735a" }}>Go</span></Link>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link to="/about" style={{ color: "#1a4a6b", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem", opacity: 1 }}>About</Link>
          <Link to="/contact" style={{ color: "#1a4a6b", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem", opacity: 0.7 }}>Contact</Link>
          <Link to="/login" style={{ color: "#e8735a", fontWeight: 600, textDecoration: "none", fontSize: "0.85rem" }}>Log In</Link>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ textAlign: "center", py: { xs: 8, md: 12 }, px: 3, background: "linear-gradient(145deg, #0f2d40 0%, #1a4a6b 50%, #1e5a80 100%)", color: "white" }}>
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
          About PackGo
        </Typography>
        <Typography sx={{ maxWidth: 600, mx: "auto", opacity: 0.8, fontSize: "1.05rem", lineHeight: 1.8 }}>
          We believe travel transforms lives. Since 2014, PackGo has helped thousands explore the world with confidence, comfort, and curiosity.
        </Typography>
      </Box>

      {/* Story */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: { xs: 6, md: 10 } }}>
        <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: "#1a4a6b", mb: 3 }}>
          Our Story
        </Typography>
        <Typography sx={{ color: "#4a6b7c", lineHeight: 1.9, mb: 3, fontSize: "0.95rem" }}>
          PackGo was born from a simple idea: travel planning should be effortless. Our founders, frustrated by the complexity of organising international trips, built a platform that brings together destination discovery, itinerary planning, and booking — all in one place.
        </Typography>
        <Typography sx={{ color: "#4a6b7c", lineHeight: 1.9, mb: 3, fontSize: "0.95rem" }}>
          What started as a small project has grown into a trusted platform serving 40,000+ travellers across 180+ countries. We partner with local guides, verified accommodations, and sustainable tourism organisations to ensure every trip is not just memorable, but responsible.
        </Typography>
      </Box>

      {/* Values */}
      <Box sx={{ backgroundColor: "#f5efe0", py: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: 900, mx: "auto", px: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: "#1a4a6b", textAlign: "center", mb: 6 }}>
            What We Stand For
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
            {VALUES.map((v, i) => (
              <Box key={i} sx={{ textAlign: "center", p: 3, background: "white", borderRadius: 4, border: "0.5px solid rgba(26,74,107,0.08)" }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 2 }}>{v.emoji}</Typography>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1a4a6b", mb: 1, fontWeight: 600 }}>{v.title}</Typography>
                <Typography sx={{ color: "#6b8fa3", fontSize: "0.88rem", lineHeight: 1.7 }}>{v.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: { xs: 6, md: 10 }, textAlign: "center" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
          {[
            { big: "2.4K+", desc: "Destinations" },
            { big: "98%", desc: "Satisfaction" },
            { big: "14yr", desc: "Experience" },
            { big: "40K+", desc: "Travellers" },
          ].map((s, i) => (
            <Box key={i}>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "#1a4a6b", fontWeight: 700 }}>{s.big}</Typography>
              <Typography sx={{ color: "#8bafc4", fontSize: "0.82rem" }}>{s.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ background: "#0f2d40", color: "rgba(253,250,245,0.7)", py: 4, px: 3, textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Typography sx={{ fontSize: "0.82rem", color: "rgba(253,250,245,0.45)" }}>
          &copy; {new Date().getFullYear()} PackGo Travel Co. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
