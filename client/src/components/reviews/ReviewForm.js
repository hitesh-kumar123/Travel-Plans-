import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import { submitReview } from "../../redux/actions/reviewActions";

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const ReviewForm = ({ initialDestination = "", onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.reviews);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    destination: initialDestination,
    rating: 0,
    title: "",
    reviewText: "",
    travelDate: "",
    image: "",
  });
  const [hoverRating, setHoverRating] = useState(-1);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageFileName, setImageFileName] = useState("");

  const validate = () => {
    const errs = {};
    if (!formData.destination.trim())
      errs.destination = "Destination is required";
    if (!formData.rating || formData.rating < 1)
      errs.rating = "Please select a rating";
    if (!formData.title.trim()) errs.title = "Title is required";
    if (formData.title.length > 120)
      errs.title = "Title cannot exceed 120 characters";
    if (formData.reviewText.trim().length < 20)
      errs.reviewText = "Review must be at least 20 characters";
    if (formData.reviewText.length > 2000)
      errs.reviewText = "Review cannot exceed 2000 characters";
    if (!formData.travelDate) errs.travelDate = "Travel date is required";
    else if (new Date(formData.travelDate) > new Date())
      errs.travelDate = "Travel date cannot be in the future";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  // Convert image to base64 data URI for optional upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors({ ...fieldErrors, image: "Image must be under 5 MB" });
      return;
    }
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    const result = await dispatch(submitReview(formData));
    if (result?.success) {
      setFormData({
        destination: initialDestination,
        rating: 0,
        title: "",
        reviewText: "",
        travelDate: "",
        image: "",
      });
      setImageFileName("");
      setFieldErrors({});
      onSuccess?.();
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Please log in to submit a review.
      </Alert>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Destination */}
      <TextField
        label="Destination"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        error={!!fieldErrors.destination}
        helperText={fieldErrors.destination}
        fullWidth
        required
        placeholder="e.g. Taj Mahal, Agra"
        disabled={!!initialDestination}
      />

      {/* Rating */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          fontWeight={500}
        >
          Your Rating *
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Rating
            name="rating"
            value={formData.rating}
            precision={1}
            emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
            onChange={(_, val) => {
              setFormData({ ...formData, rating: val });
              setFieldErrors({ ...fieldErrors, rating: "" });
            }}
            onChangeActive={(_, val) => setHoverRating(val)}
            size="large"
          />
          {(hoverRating > 0 || formData.rating > 0) && (
            <Chip
              label={
                RATING_LABELS[hoverRating > 0 ? hoverRating : formData.rating]
              }
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        {fieldErrors.rating && (
          <Typography variant="caption" color="error">
            {fieldErrors.rating}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Title */}
      <TextField
        label="Review Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!fieldErrors.title}
        helperText={fieldErrors.title || `${formData.title.length}/120`}
        fullWidth
        required
        placeholder="Summarise your experience in a few words"
        slotProps={{ htmlInput: { maxLength: 120 } }}
      />

      {/* Review Text */}
      <TextField
        label="Your Review"
        name="reviewText"
        value={formData.reviewText}
        onChange={handleChange}
        error={!!fieldErrors.reviewText}
        helperText={
          fieldErrors.reviewText ||
          `${formData.reviewText.length}/2000 (min 20 characters)`
        }
        fullWidth
        required
        multiline
        rows={5}
        placeholder="Share your experience — what did you love? What tips would you give future visitors?"
        slotProps={{ htmlInput: { maxLength: 2000 } }}
      />

      {/* Travel Date */}
      <TextField
        label="Travel Date"
        name="travelDate"
        type="date"
        value={formData.travelDate}
        onChange={handleChange}
        error={!!fieldErrors.travelDate}
        helperText={fieldErrors.travelDate}
        fullWidth
        required
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { max: today },
        }}
      />

      {/* Image Upload (optional) */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          fontWeight={500}
        >
          Photo (optional, max 5 MB)
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            size="small"
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {imageFileName && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {imageFileName}
            </Typography>
          )}
        </Box>
        {fieldErrors.image && (
          <Typography variant="caption" color="error">
            {fieldErrors.image}
          </Typography>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        endIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <SendIcon />
          )
        }
        sx={{ alignSelf: "flex-start", mt: 0.5 }}
      >
        {loading ? "Submitting…" : "Submit Review"}
      </Button>
    </Box>
  );
};

export default ReviewForm;
