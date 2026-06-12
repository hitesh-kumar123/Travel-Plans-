import React, { useState, useEffect, useCallback } from "react";
import Fab from "@mui/material/Fab";
import Fade from "@mui/material/Fade";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

const fabSx = {
  background: "linear-gradient(135deg, #3f51b5 0%, #757de8 100%)",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(63,81,181,0.4)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #002984 0%, #3f51b5 100%)",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 20px rgba(63,81,181,0.5)",
  },
};

export default function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  const update = useCallback(() => {
    const scrolled = window.scrollY;
    const atBottom =
      window.innerHeight + scrolled >= document.body.scrollHeight - 10;
    setShowTop(scrolled > 300);
    setShowBottom(!atBottom);
  }, []);

  useEffect(() => {
    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        zIndex: 1300,
      }}
    >
      <Fade in={showTop} timeout={300} unmountOnExit>
        <Tooltip title="Scroll to top" placement="left">
          <Fab size="small" onClick={scrollTop} sx={fabSx}>
            <KeyboardArrowUpIcon />
          </Fab>
        </Tooltip>
      </Fade>
      <Fade in={showBottom} timeout={300} unmountOnExit>
        <Tooltip title="Scroll to bottom" placement="left">
          <Fab size="small" onClick={scrollBottom} sx={fabSx}>
            <KeyboardArrowDownIcon />
          </Fab>
        </Tooltip>
      </Fade>
    </Box>
  );
}
