import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography, Box, TextField, Button, Grid, Paper,
  MenuItem, CircularProgress, Chip, Tooltip, IconButton, Alert
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { translateText } from "../../redux/actions/translatorActions";

const LANGUAGES = [
  { code: "auto", name: "Auto Detect" },
  { code: "en", name: "English 🇬🇧" },
  { code: "hi", name: "Hindi 🇮🇳" },
  { code: "es", name: "Spanish 🇪🇸" },
  { code: "fr", name: "French 🇫🇷" },
  { code: "de", name: "German 🇩🇪" },
  { code: "it", name: "Italian 🇮🇹" },
  { code: "ja", name: "Japanese 🇯🇵" },
  { code: "ko", name: "Korean 🇰🇷" },
  { code: "zh", name: "Chinese 🇨🇳" },
  { code: "ar", name: "Arabic 🇸🇦" },
  { code: "pt", name: "Portuguese 🇵🇹" },
  { code: "ru", name: "Russian 🇷🇺" },
];

const TARGET_LANGS = LANGUAGES.filter(l => l.code !== "auto");

const COMMON_PHRASES = [
  { label: "Hello", text: "Hello" },
  { label: "Thank you", text: "Thank you" },
  { label: "Where is...?", text: "Where is the nearest hospital?" },
  { label: "How much?", text: "How much does this cost?" },
  { label: "Help!", text: "Please help me!" },
  { label: "Taxi please", text: "Please call me a taxi" },
];

const TranslatorView = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");
  const [copied, setCopied] = useState(false);

  const { translation, loading, error } = useSelector((state) => state.translator);
  const translatedText = translation?.translatedText || "";

  const handleTranslate = () => {
    if (text.trim()) {
      dispatch(translateText({ text, sourceLanguage: sourceLang, targetLanguage: targetLang }));
    }
  };

  const handleSwap = () => {
    if (sourceLang !== "auto" && translatedText) {
      setText(translatedText);
      const oldTarget = targetLang;
      setTargetLang(sourceLang);
      setSourceLang(oldTarget);
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Live Translator</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Translate text instantly for your travels
      </Typography>

      {/* Common Phrases */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary">
          🗣️ Common Travel Phrases
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {COMMON_PHRASES.map((p) => (
            <Chip
              key={p.label} label={p.label} clickable
              onClick={() => setText(p.text)}
              color={text === p.text ? "primary" : "default"}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>
      </Paper>

      {/* Translation Box */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <TextField
              select fullWidth label="From" value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)} sx={{ mb: 2 }}>
              {LANGUAGES.map(l => <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>)}
            </TextField>
            <TextField
              fullWidth multiline rows={6} variant="outlined"
              placeholder="Enter text to translate..."
              value={text} onChange={(e) => setText(e.target.value)}
              sx={{ bgcolor: "grey.50", borderRadius: 2 }}
            />
            <Button
              variant="contained" fullWidth startIcon={<TranslateIcon />}
              onClick={handleTranslate} disabled={loading || !text.trim()}
              sx={{ mt: 2, height: 48, borderRadius: 3, fontWeight: 700 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Translate"}
            </Button>
          </Paper>
        </Grid>

        {/* Swap Button */}
        <Grid item xs={12} md={2} sx={{ textAlign: "center" }}>
          <Tooltip title="Swap languages">
            <span>
              <IconButton
                onClick={handleSwap} disabled={sourceLang === "auto"}
                sx={{
                  width: 52, height: 52,
                  background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
                  color: "white",
                  "&:hover": { transform: "rotate(180deg)", transition: "transform 0.4s" },
                  "&:disabled": { bgcolor: "grey.300", color: "grey.500" }
                }}>
                <SwapHorizIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0}
            sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "primary.light", height: "100%", background: "linear-gradient(135deg, #1976D2 0%, #0d47a1 100%)", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <TextField
                select label="To" value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                sx={{
                  width: "70%",
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.7)" },
                  },
                  "& .MuiSelect-icon": { color: "white" },
                }}>
                {TARGET_LANGS.map(l => <MenuItem key={l.code} value={l.code} sx={{ color: "text.primary" }}>{l.name}</MenuItem>)}
              </TextField>
              <Tooltip title={copied ? "Copied!" : "Copy translation"}>
                <IconButton onClick={handleCopy} sx={{ color: "white" }}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ minHeight: 170, p: 2, bgcolor: "rgba(255,255,255,0.12)", borderRadius: 2, display: "flex", alignItems: "center" }}>
              {loading ? (
                <CircularProgress color="inherit" size={28} sx={{ mx: "auto" }} />
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 400, lineHeight: 1.6, width: "100%" }}>
                  {translatedText || <span style={{ opacity: 0.6 }}>Translation will appear here...</span>}
                </Typography>
              )}
            </Box>

            {copied && (
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", mt: 1, display: "block" }}>
                ✓ Copied to clipboard!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="warning" sx={{ mt: 3, borderRadius: 3 }}>
          Translation service may be temporarily unavailable. Please try again shortly.
        </Alert>
      )}

      {/* Travel Language Tips */}
      <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1.5}>✈️ Language Tips for Travelers</Typography>
        <Grid container spacing={2}>
          {[
            { tip: "Always learn: Hello, Thank you, Sorry, and Help", icon: "💡" },
            { tip: "Carry a translated card for dietary restrictions", icon: "🍽️" },
            { tip: "Save emergency translations offline before travel", icon: "🚨" },
            { tip: "Download Google Translate's offline language pack", icon: "📱" },
          ].map((t, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Typography sx={{ fontSize: 22 }}>{t.icon}</Typography>
                <Typography variant="body2" color="text.secondary">{t.tip}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TranslatorView;
