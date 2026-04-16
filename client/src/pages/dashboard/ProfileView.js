import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box, Typography, Paper, Grid, TextField, Button, Avatar,
  Divider, Alert, CircularProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../services/api";
import { loadUser } from "../../redux/actions/authActions";

const ProfileView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { trips } = useSelector((state) => state.trips);

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const totalTrips = trips?.length || 0;
  const completedTrips = trips?.filter(t => t.status === "completed")?.length || 0;
  const plannedTrips = trips?.filter(t => t.status === "planned")?.length || 0;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put("/auth/profile", profileForm);
      dispatch(loadUser());
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.msg || "Failed to update profile" });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(null), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords don't match!" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.msg || "Failed to change password" });
    } finally {
      setSavingPw(false);
      setTimeout(() => setPwMsg(null), 3000);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>My Profile</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Manage your account settings</Typography>

      <Grid container spacing={3}>
        {/* Left: Avatar + Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100, height: 100, mx: "auto", mb: 2,
                background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
                fontSize: 36, fontWeight: 700
              }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>{user?.name || "Traveler"}</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>{user?.email}</Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h5" fontWeight={800} color="primary.main">{totalTrips}</Typography>
                <Typography variant="caption" color="text.secondary">Total Trips</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" fontWeight={800} color="success.main">{completedTrips}</Typography>
                <Typography variant="caption" color="text.secondary">Completed</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" fontWeight={800} color="info.main">{plannedTrips}</Typography>
                <Typography variant="caption" color="text.secondary">Planned</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ p: 2, bgcolor: "primary.light", borderRadius: 2 }}>
              <Typography variant="body2" color="primary.dark" fontWeight={600}>
                🌍 Keep exploring! Your next adventure awaits.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right: Edit Forms */}
        <Grid item xs={12} md={8}>
          {/* Profile Info */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Personal Information</Typography>
            </Box>

            {profileMsg && (
              <Alert severity={profileMsg.type} sx={{ mb: 2 }} onClose={() => setProfileMsg(null)}>
                {profileMsg.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleProfileSave}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Full Name" value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Email Address" type="email" value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit" variant="contained" startIcon={savingProfile ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    disabled={savingProfile} sx={{ px: 4, borderRadius: 3 }}>
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Change Password */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <LockIcon color="warning" />
              <Typography variant="h6" fontWeight={700}>Change Password</Typography>
            </Box>

            {pwMsg && (
              <Alert severity={pwMsg.type} sx={{ mb: 2 }} onClose={() => setPwMsg(null)}>
                {pwMsg.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Current Password" type="password"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="New Password" type="password"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Confirm New Password" type="password"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    required />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit" variant="outlined" color="warning"
                    startIcon={savingPw ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
                    disabled={savingPw} sx={{ px: 4, borderRadius: 3 }}>
                    {savingPw ? "Changing..." : "Change Password"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileView;
