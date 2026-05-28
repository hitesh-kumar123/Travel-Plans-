import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, TextField, Button, useTheme } from "@mui/material";
import { toast } from "react-toastify";

const CONTACT_INFO = [
  { icon: "📧", title: "Email", detail: "hello@packgo.travel", desc: "We respond within 24 hours" },
  { icon: "📞", title: "Phone", detail: "+1 (555) 123-4567", desc: "Mon-Fri, 9AM-6PM EST" },
  { icon: "📍", title: "Office", detail: "Bandra Kurla Complex, Mumbai", desc: "India — 400051" },
];

export default function Contact() {
  const theme = useTheme();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      {/* Nav */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 3, md: 6 }, py: 2, borderBottom: "0.5px solid rgba(26,74,107,0.12)", background: "rgba(253,250,245,0.92)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1a4a6b", textDecoration: "none" }}>Pack<span style={{ color: "#e8735a" }}>Go</span></Link>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link to="/about" style={{ color: "#1a4a6b", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem", opacity: 0.7 }}>About</Link>
          <Link to="/contact" style={{ color: "#1a4a6b", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem", opacity: 1 }}>Contact</Link>
          <Link to="/login" style={{ color: "#e8735a", fontWeight: 600, textDecoration: "none", fontSize: "0.85rem" }}>Log In</Link>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ textAlign: "center", py: { xs: 8, md: 12 }, px: 3, background: "linear-gradient(145deg, #0f2d40 0%, #1a4a6b 50%, #1e5a80 100%)", color: "white" }}>
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
          Get in Touch
        </Typography>
        <Typography sx={{ maxWidth: 500, mx: "auto", opacity: 0.8, fontSize: "1.05rem" }}>
          Have a question, suggestion, or just want to say hello? We'd love to hear from you.
        </Typography>
      </Box>

      {/* Contact Info Cards */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3, mt: { xs: -4, md: -5 }, position: "relative", zIndex: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
          {CONTACT_INFO.map((item, i) => (
            <Box key={i} sx={{ background: "white", borderRadius: 4, p: 3, textAlign: "center", boxShadow: "0 8px 32px rgba(15,45,64,0.1)", border: "0.5px solid rgba(26,74,107,0.08)" }}>
              <Typography sx={{ fontSize: "2rem", mb: 1 }}>{item.icon}</Typography>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", color: "#1a4a6b", fontWeight: 600, mb: 0.5 }}>{item.title}</Typography>
              <Typography sx={{ color: "#1a4a6b", fontSize: "0.9rem", fontWeight: 500 }}>{item.detail}</Typography>
              <Typography sx={{ color: "#8bafc4", fontSize: "0.78rem", mt: 0.5 }}>{item.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Contact Form */}
      <Box sx={{ maxWidth: 700, mx: "auto", px: 3, py: { xs: 6, md: 10 } }}>
        <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: "#1a4a6b", mb: 1 }}>
          Send us a Message
        </Typography>
        <Typography sx={{ color: "#6b8fa3", fontSize: "0.9rem", mb: 4 }}>
          Fill out the form below and our team will get back to you within 24 hours.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
            <TextField label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField label="Your Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required fullWidth />
          </Box>
          <TextField label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required fullWidth />
          <TextField label="Message" multiline rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required fullWidth />
          <Button type="submit" variant="contained" disabled={sending} sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, background: "#e8735a", "&:hover": { background: "#d65e42" }, maxWidth: 200 }}>
            {sending ? "Sending..." : "Send Message"}
          </Button>
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
