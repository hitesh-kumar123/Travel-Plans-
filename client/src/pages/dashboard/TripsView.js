import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography, Box, Button, Grid, Paper, Card, CardContent,
  CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Autocomplete, CircularProgress, Chip, MenuItem, LinearProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getTrips, addTrip } from "../../redux/actions/tripActions";
import api from "../../services/api";

const STATUS_COLORS = { planned: "primary", ongoing: "warning", completed: "success" };

const TripsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trips, loading } = useSelector((state) => state.trips);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    budget: "",
    status: "planned",
  });

  const [filter, setFilter] = useState("all");
  const [options, setOptions] = useState([]);
  const [loadingOpts, setLoadingOpts] = useState(false);

  useEffect(() => {
    dispatch(getTrips());
  }, [dispatch]);

  const fetchDestinations = async (query) => {
    if (!query) { setOptions([]); return; }
    setLoadingOpts(true);
    try {
      const res = await api.get(`/destinations/search?q=${query}`);
      setOptions(res.data.map(d => d.name));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOpts(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate) return;
    dispatch(addTrip({ ...formData, budget: parseFloat(formData.budget) || 0 }));
    setOpen(false);
    setFormData({ destination: "", startDate: "", endDate: "", description: "", budget: "", status: "planned" });
  };

  const filteredTrips = trips ? (filter === "all" ? trips : trips.filter(t => t.status === filter)) : [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>My Trips</Typography>
          <Typography variant="body2" color="text.secondary">{trips?.length || 0} trips so far</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, px: 3 }}>
          New Trip
        </Button>
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {["all", "planned", "ongoing", "completed"].map(f => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            onClick={() => setFilter(f)}
            color={filter === f ? "primary" : "default"}
            sx={{ fontWeight: 600, cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* NEW TRIP MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Plan a New Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Autocomplete
              freeSolo options={options} loading={loadingOpts}
              onInputChange={(event, newInputValue) => {
                handleChange({ target: { name: "destination", value: newInputValue } });
                if (newInputValue && newInputValue.length >= 2) fetchDestinations(newInputValue);
                else setOptions([]);
              }}
              value={formData.destination}
              onChange={(event, newValue) => {
                handleChange({ target: { name: "destination", value: newValue || "" } });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Destination *" name="destination"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingOpts ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth name="startDate" label="Start Date *" type="date" InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth name="endDate" label="End Date *" type="date" InputLabelProps={{ shrink: true }} value={formData.endDate} onChange={handleChange} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth name="budget" label="Budget (₹)" type="number" value={formData.budget} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth select name="status" label="Status" value={formData.status} onChange={handleChange}>
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField fullWidth name="description" label="Trip Notes" multiline rows={3} value={formData.description} onChange={handleChange} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ px: 3 }}>Create Trip</Button>
        </DialogActions>
      </Dialog>

      {/* Trips Grid */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <Paper sx={{ height: 280, borderRadius: 4 }} elevation={0} />
            </Grid>
          ))
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map(trip => {
            const days = trip.startDate && trip.endDate
              ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
              : 0;
            return (
              <Grid item xs={12} md={6} lg={4} key={trip._id}>
                <Card
                  elevation={0}
                  sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden", transition: "transform 0.25s, box-shadow 0.25s", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}
                >
                  <CardActionArea onClick={() => navigate(`/dashboard/trips/${trip._id}`)}>
                    <Box sx={{ position: "relative", pt: "55%" }}>
                      <Box
                        component="img"
                        src={(trip.images && trip.images.length > 0) ? trip.images[0] : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=600"}
                        alt={trip.destination}
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                        <Chip label={trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                          color={STATUS_COLORS[trip.status] || "default"} size="small" sx={{ fontWeight: 700 }} />
                      </Box>
                    </Box>
                    <CardContent sx={{ pb: "12px !important" }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>{trip.destination}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <DateRangeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(trip.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} →{" "}
                          {new Date(trip.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          {days > 0 && ` (${days}d)`}
                        </Typography>
                      </Box>
                      {trip.budget > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccountBalanceWalletIcon fontSize="small" color="success" />
                          <Typography variant="body2" color="success.main" fontWeight={600}>
                            Budget: ₹{trip.budget.toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "2px dashed", borderColor: "divider" }} elevation={0}>
              <FlightTakeoffIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {filter === "all" ? "No trips yet!" : `No ${filter} trips`}
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ mt: 1 }}>
                Plan Your First Trip
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TripsView;
