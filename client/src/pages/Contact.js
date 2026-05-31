import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  useTheme,
} from "@mui/material";

const Contact = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Contact Support
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Have any questions or need help? Please fill out the form below and
            our support team will get back to you as soon as possible.
          </Typography>

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: 500,
              mx: "auto",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent successfully!");
            }}
          >
            <TextField
              required
              id="name"
              label="Your Name"
              variant="outlined"
              fullWidth
            />
            <TextField
              required
              id="email"
              label="Your Email"
              type="email"
              variant="outlined"
              fullWidth
            />
            <TextField
              required
              id="message"
              label="Your Message"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.5,
                mt: 2,
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
