import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Divider,
  Rating,
  CircularProgress,
  Collapse,
  Badge,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import {
  searchFlights,
  searchHotels,
} from "../../redux/actions/bookingActions";

const amenityIcons = {
  WiFi: <WifiIcon fontSize="small" />,
  Pool: <PoolIcon fontSize="small" />,
  Restaurant: <RestaurantIcon fontSize="small" />,
  Parking: <LocalParkingIcon fontSize="small" />,
};

const AMENITY_OPTIONS = [
  "WiFi",
  "Pool",
  "Restaurant",
  "Parking",
  "Gym",
  "Spa",
  "Breakfast",
  "Bar",
];

const BookingView = () => {
  const dispatch = useDispatch();
  const { flights, hotels, loading } = useSelector((state) => state.booking);

  const [tab, setTab] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [flightForm, setFlightForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
  });

  const [hotelForm, setHotelForm] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
  });

  // Flight filters
  const [flightFilters, setFlightFilters] = useState({
    minBudget: "",
    maxBudget: "",
  });

  // Hotel filters
  const [hotelFilters, setHotelFilters] = useState({
    minBudget: "",
    maxBudget: "",
    minRating: 0,
    amenities: [],
  });

  // Count active filters for badge
  const activeFlightFilterCount = [
    flightFilters.minBudget,
    flightFilters.maxBudget,
  ].filter(Boolean).length;

  const activeHotelFilterCount = [
    hotelFilters.minBudget,
    hotelFilters.maxBudget,
    hotelFilters.minRating > 0 ? hotelFilters.minRating : null,
    ...hotelFilters.amenities,
  ].filter(Boolean).length;

  const handleFlightSearch = (e) => {
    e.preventDefault();
    dispatch(searchFlights({ ...flightForm, ...flightFilters }));
  };

  const handleHotelSearch = (e) => {
    e.preventDefault();
    dispatch(searchHotels({ ...hotelForm, ...hotelFilters }));
  };

  const handleAmenityToggle = (amenity) => {
    setHotelFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const clearFlightFilters = () => {
    setFlightFilters({ minBudget: "", maxBudget: "" });
  };

  const clearHotelFilters = () => {
    setHotelFilters({
      minBudget: "",
      maxBudget: "",
      minRating: 0,
      amenities: [],
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        Travel Bookings
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Search for flights and hotels for your trips
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => {
            setTab(v);
            setShowFilters(false);
          }}
          sx={{ borderBottom: "1px solid", borderColor: "divider", px: 2 }}
        >
          <Tab
            icon={<FlightIcon />}
            iconPosition="start"
            label="Flights"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<HotelIcon />}
            iconPosition="start"
            label="Hotels"
            sx={{ fontWeight: 600 }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* ───── FLIGHT SEARCH ───── */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleFlightSearch}>
              <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
                <Grid xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="From (City/Airport)"
                    placeholder="e.g. Delhi"
                    value={flightForm.origin}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, origin: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="To (City/Airport)"
                    placeholder="e.g. Mumbai"
                    value={flightForm.destination}
                    onChange={(e) =>
                      setFlightForm({
                        ...flightForm,
                        destination: e.target.value,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid xs={6} md={2.4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Departure"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ placeholder: "" }}
                    sx={{
                      "& .MuiOutlinedInput-input[type='date']": {
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        width: "100%",
                      },
                    }}
                    value={flightForm.departureDate}
                    onChange={(e) =>
                      setFlightForm({
                        ...flightForm,
                        departureDate: e.target.value,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid xs={6} md={2.4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Return (optional)"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ placeholder: "" }}
                    sx={{
                      "& .MuiOutlinedInput-input[type='date']": {
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        width: "100%",
                      },
                    }}
                    value={flightForm.returnDate}
                    onChange={(e) =>
                      setFlightForm({
                        ...flightForm,
                        returnDate: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Badge
                      badgeContent={activeFlightFilterCount}
                      color="primary"
                    >
                      <Button
                        variant={showFilters ? "contained" : "outlined"}
                        size="large"
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ height: 56, borderRadius: 3, minWidth: 56 }}
                      >
                        <FilterListIcon />
                      </Button>
                    </Badge>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<SearchIcon />}
                      disabled={loading}
                      sx={{ height: 56, borderRadius: 3, fontWeight: 700 }}
                    >
                      {loading ? <CircularProgress size={20} /> : "Search"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Flight Filters Panel */}
              <Collapse in={showFilters}>
                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      Filter Flights
                    </Typography>
                    {activeFlightFilterCount > 0 && (
                      <Button
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={clearFlightFilters}
                        color="error"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" fontWeight={600} mb={1}>
                        💰 Budget Range (USD)
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Min ($)"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={flightFilters.minBudget}
                          onChange={(e) =>
                            setFlightFilters({
                              ...flightFilters,
                              minBudget: e.target.value,
                            })
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Max ($)"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={flightFilters.maxBudget}
                          onChange={(e) =>
                            setFlightFilters({
                              ...flightFilters,
                              maxBudget: e.target.value,
                            })
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
          )}

          {/* ───── HOTEL SEARCH ───── */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleHotelSearch}>
              <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
                <Grid xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="Destination / City"
                    placeholder="e.g. Goa"
                    value={hotelForm.location}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, location: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid xs={6} md={2.4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-in"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ placeholder: "" }}
                    sx={{
                      "& .MuiOutlinedInput-input[type='date']": {
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        width: "100%",
                      },
                    }}
                    value={hotelForm.checkIn}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, checkIn: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid xs={6} md={2.4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-out"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ placeholder: "" }}
                    sx={{
                      "& .MuiOutlinedInput-input[type='date']": {
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        width: "100%",
                      },
                    }}
                    value={hotelForm.checkOut}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, checkOut: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid xs={6} md={2.4}>
                  <TextField
                    fullWidth
                    select
                    label="Guests"
                    value={hotelForm.guests}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, guests: e.target.value })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <MenuItem key={n} value={n}>
                        {n} Guest{n > 1 ? "s" : ""}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Badge
                      badgeContent={activeHotelFilterCount}
                      color="primary"
                    >
                      <Button
                        variant={showFilters ? "contained" : "outlined"}
                        size="large"
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ height: 56, borderRadius: 3, minWidth: 56 }}
                      >
                        <FilterListIcon />
                      </Button>
                    </Badge>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<SearchIcon />}
                      disabled={loading}
                      sx={{ height: 56, borderRadius: 3, fontWeight: 700 }}
                    >
                      {loading ? <CircularProgress size={20} /> : "Search"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Hotel Filters Panel */}
              <Collapse in={showFilters}>
                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      Filter Hotels
                    </Typography>
                    {activeHotelFilterCount > 0 && (
                      <Button
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={clearHotelFilters}
                        color="error"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </Box>
                  <Grid container spacing={3}>
                    {/* Budget */}
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" fontWeight={600} mb={1}>
                        💰 Budget Range (USD/night)
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Min ($)"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={hotelFilters.minBudget}
                          onChange={(e) =>
                            setHotelFilters({
                              ...hotelFilters,
                              minBudget: e.target.value,
                            })
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Max ($)"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={hotelFilters.maxBudget}
                          onChange={(e) =>
                            setHotelFilters({
                              ...hotelFilters,
                              maxBudget: e.target.value,
                            })
                          }
                        />
                      </Box>
                    </Grid>

                    {/* Rating */}
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" fontWeight={600} mb={1}>
                        ⭐ Minimum Rating
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Rating
                          value={hotelFilters.minRating}
                          precision={0.5}
                          onChange={(e, val) =>
                            setHotelFilters({
                              ...hotelFilters,
                              minRating: val || 0,
                            })
                          }
                        />
                        {hotelFilters.minRating > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            {hotelFilters.minRating}+
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    {/* Amenities */}
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" fontWeight={600} mb={1}>
                        🏊 Amenities
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {AMENITY_OPTIONS.map((amenity) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            size="small"
                            icon={amenityIcons[amenity] || null}
                            onClick={() => handleAmenityToggle(amenity)}
                            color={
                              hotelFilters.amenities.includes(amenity)
                                ? "primary"
                                : "default"
                            }
                            variant={
                              hotelFilters.amenities.includes(amenity)
                                ? "filled"
                                : "outlined"
                            }
                            sx={{
                              cursor: "pointer",
                              fontSize: "11px",
                              height: 26,
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Paper>

      {/* ───── FLIGHT RESULTS ───── */}
      {tab === 0 && flights && flights.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            {flights.length} Flight{flights.length !== 1 ? "s" : ""} Found
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {flights.map((flight) => (
              <Paper
                key={flight.id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { boxShadow: 4 },
                  transition: "box-shadow 0.2s",
                }}
              >
                <Grid container sx={{ alignItems: "center" }} spacing={2}>
                  <Grid xs={12} sm={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FlightIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {flight.airline}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Economy
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" fontWeight={700}>
                          {flight.departureTime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {flight.origin}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary">
                          {flight.duration}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Divider sx={{ flex: 1 }} />
                          <FlightIcon
                            sx={{
                              fontSize: 14,
                              color: "text.disabled",
                              transform: "rotate(90deg)",
                            }}
                          />
                          <Divider sx={{ flex: 1 }} />
                        </Box>
                        <Chip
                          label="Non-stop"
                          size="small"
                          color="success"
                          sx={{ fontSize: "10px", height: 18 }}
                        />
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" fontWeight={700}>
                          {flight.arrivalTime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {flight.destination}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="primary.main"
                    >
                      ${flight.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per person
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 3 }}
                    >
                      Select
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* No flight results after filtering */}
      {tab === 0 && flights && flights.length === 0 && !loading && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <FlightIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No flights found matching your filters
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            Try adjusting your budget range
          </Typography>
        </Paper>
      )}

      {/* ───── HOTEL RESULTS ───── */}
      {tab === 1 && hotels && hotels.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            {hotels.length} Hotel{hotels.length !== 1 ? "s" : ""} Found
          </Typography>
          <Grid container spacing={3}>
            {hotels.map((hotel) => (
              <Grid xs={12} md={6} lg={4} key={hotel.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                    "&:hover": { boxShadow: 4 },
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HotelIcon
                      sx={{ fontSize: 64, color: "primary.main", opacity: 0.4 }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {hotel.address}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Rating
                        value={hotel.rating}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption">
                        ({hotel.rating})
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      {hotel.amenities?.map((a) => (
                        <Chip
                          key={a}
                          label={a}
                          size="small"
                          icon={amenityIcons[a] || null}
                          sx={{ fontSize: "11px", height: 22 }}
                        />
                      ))}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          color="primary.main"
                        >
                          ${hotel.price}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          per night
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ borderRadius: 3 }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No hotel results after filtering */}
      {tab === 1 && hotels && hotels.length === 0 && !loading && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <HotelIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hotels found matching your filters
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            Try adjusting your budget, rating, or amenities
          </Typography>
        </Paper>
      )}

      {/* Empty State */}
      {tab === 0 &&
        (!flights || flights.length === 0) &&
        !loading &&
        !flights && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <FlightIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Search for available flights above
            </Typography>
          </Paper>
        )}
      {tab === 1 && (!hotels || hotels.length === 0) && !loading && !hotels && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <HotelIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Search for available hotels above
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BookingView;
