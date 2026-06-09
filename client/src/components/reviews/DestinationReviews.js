import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Divider,
  // Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {
  getDestinationReviews,
  clearReviewError,
} from "../../redux/actions/reviewActions";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import RatingSummary from "./RatingSummary";

const DestinationReviews = ({ destination }) => {
  const dispatch = useDispatch();
  const { destinationReviews, destinationAverage, destinationTotal, loading } =
    useSelector((s) => s.reviews);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [sort, setSort] = useState("recent");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (destination) {
      dispatch(getDestinationReviews(destination, sort));
    }
  }, [dispatch, destination, sort]);

  const handleFormSuccess = () => {
    setFormOpen(false);
    dispatch(getDestinationReviews(destination, sort));
  };

  return (
    <Box>
      {/* Section header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Traveler Reviews
        </Typography>
        <Button
          variant="contained"
          startIcon={<RateReviewIcon />}
          onClick={() => setFormOpen(true)}
          size="small"
        >
          Leave a Review
        </Button>
      </Box>

      {/* Rating summary */}
      {destinationTotal > 0 && (
        <Box mb={3}>
          <RatingSummary
            averageRating={destinationAverage}
            totalCount={destinationTotal}
            ratingDistribution={destinationReviews.reduce((acc, r) => {
              acc[r.rating] = (acc[r.rating] || 0) + 1;
              return acc;
            }, {})}
          />
        </Box>
      )}

      {/* Sort control */}
      {destinationTotal > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="highest">Highest Rated</MenuItem>
              <MenuItem value="helpful">Most Helpful</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Reviews list */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : destinationReviews.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            px: 2,
            bgcolor: "grey.50",
            borderRadius: 3,
          }}
        >
          <RateReviewIcon sx={{ fontSize: 48, color: "grey.300", mb: 1 }} />
          <Typography color="text.secondary">
            No reviews yet for {destination}.
          </Typography>
          {isAuthenticated && (
            <Button
              variant="outlined"
              onClick={() => setFormOpen(true)}
              sx={{ mt: 2 }}
            >
              Be the first to review
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {destinationReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </Box>
      )}

      {/* Review Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          Review {destination}
          <IconButton
            size="small"
            onClick={() => {
              setFormOpen(false);
              dispatch(clearReviewError());
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <ReviewForm
            initialDestination={destination}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DestinationReviews;
