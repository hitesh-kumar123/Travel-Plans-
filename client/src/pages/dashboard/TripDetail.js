import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box, Typography, Button, Grid, Paper, Chip, Divider,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, MenuItem, IconButton, Tooltip, LinearProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PlaceIcon from "@mui/icons-material/Place";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getTrip, updateTrip, deleteTrip } from "../../redux/actions/tripActions";
import { getExpenses, addExpense, deleteExpense } from "../../redux/actions/expenseActions";

const STATUS_COLORS = {
  planned: "primary",
  ongoing: "warning",
  completed: "success",
};

const EXPENSE_CATEGORIES = ["Accommodation", "Transportation", "Food", "Activities", "Shopping", "Other"];

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentTrip, loading } = useSelector((state) => state.trips);
  const { expenses, loading: expLoading } = useSelector((state) => state.expenses);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0], currency: "INR"
  });

  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(getTrip(id));
    dispatch(getExpenses(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTrip) {
      setEditForm({
        destination: currentTrip.destination || "",
        startDate: currentTrip.startDate ? new Date(currentTrip.startDate).toISOString().split("T")[0] : "",
        endDate: currentTrip.endDate ? new Date(currentTrip.endDate).toISOString().split("T")[0] : "",
        description: currentTrip.description || "",
        budget: currentTrip.budget || 0,
        status: currentTrip.status || "planned",
      });
    }
  }, [currentTrip]);

  const totalSpent = expenses ? expenses.reduce((acc, e) => acc + e.amount, 0) : 0;
  const budgetPercent = currentTrip?.budget > 0 ? Math.min((totalSpent / currentTrip.budget) * 100, 100) : 0;

  const handleDeleteTrip = () => {
    dispatch(deleteTrip(id));
    navigate("/dashboard/trips");
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    dispatch(addExpense({ ...expenseForm, trip: id, amount: parseFloat(expenseForm.amount) }));
    setExpenseOpen(false);
    setExpenseForm({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0], currency: "INR" });
  };

  const handleEditTrip = (e) => {
    e.preventDefault();
    dispatch(updateTrip(id, editForm));
    setEditOpen(false);
  };

  const tripImage = currentTrip?.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=1200";

  if (loading && !currentTrip) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;
  }

  if (!currentTrip) return null;

  const daysCount = currentTrip.startDate && currentTrip.endDate
    ? Math.ceil((new Date(currentTrip.endDate) - new Date(currentTrip.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Back + Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} component={Link} to="/dashboard/trips" color="inherit">
          Back to Trips
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit Trip">
            <IconButton onClick={() => setEditOpen(true)} color="primary" sx={{ bgcolor: "primary.light" }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Trip">
            <IconButton onClick={() => setDeleteOpen(true)} color="error" sx={{ bgcolor: "error.light" }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Hero Image */}
      <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", mb: 3, height: { xs: 200, md: 320 } }}>
        <Box component="img" src={tripImage} alt={currentTrip.destination}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Box sx={{
          position: "absolute", bottom: 0, left: 0, right: 0, p: 3,
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          color: "white"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PlaceIcon fontSize="small" />
            <Typography variant="h4" fontWeight={700}>{currentTrip.destination}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={currentTrip.status?.charAt(0).toUpperCase() + currentTrip.status?.slice(1)}
              color={STATUS_COLORS[currentTrip.status] || "default"}
              size="small" sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<DateRangeIcon style={{ color: "white" }} />}
              label={`${daysCount} days`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Trip Info Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
                <DateRangeIcon color="primary" />
                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>Start Date</Typography>
                <Typography variant="body2" fontWeight={600}>{new Date(currentTrip.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
                <DateRangeIcon color="secondary" />
                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>End Date</Typography>
                <Typography variant="body2" fontWeight={600}>{new Date(currentTrip.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
                <AccountBalanceWalletIcon color="success" />
                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>Budget</Typography>
                <Typography variant="body2" fontWeight={600}>₹{(currentTrip.budget || 0).toLocaleString()}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
                <AccountBalanceWalletIcon color="warning" />
                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>Spent</Typography>
                <Typography variant="body2" fontWeight={600}>₹{totalSpent.toLocaleString()}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Budget Progress */}
          {currentTrip.budget > 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>Budget Utilization</Typography>
                <Typography variant="subtitle2" fontWeight={700} color={budgetPercent > 90 ? "error.main" : "success.main"}>
                  {budgetPercent.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={budgetPercent}
                color={budgetPercent > 90 ? "error" : budgetPercent > 70 ? "warning" : "success"}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="caption" color="text.secondary">Spent: ₹{totalSpent.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">Budget: ₹{(currentTrip.budget || 0).toLocaleString()}</Typography>
              </Box>
            </Paper>
          )}

          {/* Description */}
          {currentTrip.description && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>About this Trip</Typography>
              <Typography color="text.secondary">{currentTrip.description}</Typography>
            </Paper>
          )}

          {/* Accommodation */}
          {currentTrip.accommodation?.name && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <HotelIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>Accommodation</Typography>
              </Box>
              <Typography fontWeight={600}>{currentTrip.accommodation.name}</Typography>
              {currentTrip.accommodation.address && <Typography color="text.secondary">{currentTrip.accommodation.address}</Typography>}
              {currentTrip.accommodation.bookingRef && <Chip label={`Ref: ${currentTrip.accommodation.bookingRef}`} size="small" sx={{ mt: 1 }} />}
            </Paper>
          )}

          {/* Transportation */}
          {currentTrip.transportation?.type && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <FlightIcon color="info" />
                <Typography variant="subtitle1" fontWeight={700}>Transportation</Typography>
              </Box>
              <Typography fontWeight={600}>{currentTrip.transportation.type}</Typography>
              {currentTrip.transportation.bookingRef && <Chip label={`Ref: ${currentTrip.transportation.bookingRef}`} size="small" sx={{ mt: 1 }} />}
            </Paper>
          )}
        </Grid>

        {/* Right Column: Expenses */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={700}>Expenses</Typography>
              <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setExpenseOpen(true)}>
                Add
              </Button>
            </Box>
            <Divider />
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>₹</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expLoading ? (
                    <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={20} /></TableCell></TableRow>
                  ) : expenses && expenses.length > 0 ? (
                    expenses.map((e) => (
                      <TableRow key={e._id} hover>
                        <TableCell><Chip label={e.category} size="small" /></TableCell>
                        <TableCell sx={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description || "-"}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{e.amount.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => dispatch(deleteExpense(e._id))}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>No expenses yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {expenses && expenses.length > 0 && (
              <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
                <Typography variant="subtitle2" fontWeight={700} color="primary.main">₹{totalSpent.toLocaleString()}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Trip?</DialogTitle>
        <DialogContentText sx={{ px: 3 }}>
          This will permanently delete your trip to <strong>{currentTrip.destination}</strong> and all associated expenses.
        </DialogContentText>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTrip} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={expenseOpen} onClose={() => setExpenseOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Amount (₹)" type="number" required
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth select label="Currency" value={expenseForm.currency}
                  onChange={(e) => setExpenseForm({ ...expenseForm, currency: e.target.value })}>
                  {["INR", "USD", "EUR", "GBP"].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            <TextField fullWidth select label="Category" value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
              {EXPENSE_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Description / Note" value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
            <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }}
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setExpenseOpen(false)}>Cancel</Button>
          <Button onClick={handleAddExpense} variant="contained">Save Expense</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Trip</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField fullWidth label="Destination" value={editForm.destination || ""}
              onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }}
                  value={editForm.startDate || ""}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }}
                  value={editForm.endDate || ""}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Budget (₹)" type="number" value={editForm.budget || ""}
                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth select label="Status" value={editForm.status || "planned"}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField fullWidth multiline rows={3} label="Notes" value={editForm.description || ""}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditTrip} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TripDetail;
