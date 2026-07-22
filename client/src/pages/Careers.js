import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";

const openings = [
  {
    title: "Frontend Developer",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Backend Developer (Node.js)",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    location: "Remote",
    type: "Part-time",
  },
];

const Careers = () => {
  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <WorkIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Careers at PackGo
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            We're building the future of travel planning. Explore our open roles
            below.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {openings.map((job) => (
            <Grid item xs={12} key={job.title}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.location} · {job.type}
                  </Typography>
                </Box>
                <Button variant="contained" size="medium">
                  Apply Now
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Don't see a role that fits? Reach out anyway, we'd love to hear from
            you.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Careers;
